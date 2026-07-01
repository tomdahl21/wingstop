/**
 * Refund & Resolution Matrix — deterministic policy engine (PRD §8.4, REF-01..05, GP1).
 *
 * THE MODEL DECIDES NOTHING ABOUT MONEY. Lil Ranchie reads from this engine, presents
 * the eligible path, and logs the outcome. Every amount, every auto-approve decision,
 * every threshold lives here in plain, testable code — never in a prompt.
 *
 * This is the direct answer to the Air Canada failure mode: a chatbot cannot invent a
 * refund, and a Brand Partner cannot quietly decline an eligible one (REF-04).
 *
 * Thresholds are illustrative pending Ops/Finance/Legal sign-off (OQ2). Loyalty tier and
 * prior-claim frequency modify limits.
 */

import type {
  Guest,
  IssueType,
  Order,
  ResolutionMethod,
  ResolutionOption,
} from "./types";

/** ~30 loyalty points per dollar (calibrated to the design-system reference flow). */
export const POINTS_PER_DOLLAR = 30;

/** Gold/VIP get a more generous auto-approve ceiling. */
const TIER_MULTIPLIER: Record<Guest["tier"], number> = {
  Member: 1,
  Silver: 1,
  Gold: 1.2,
  VIP: 1.35,
};

/** Guests with a history of frequent claims drop out of auto-approve. */
const PRIOR_CLAIM_FATIGUE_LIMIT = 4;

interface MatrixRow {
  label: string;
  policyPath: string;
  /** Resolutions the guest may pick from, in presentation order. */
  resolutions: ResolutionMethod[];
  /** Base auto-approve ceiling in USD. `null` => points-only path (no cash). */
  baseAutoApprove: number | null;
  /** Photo evidence required before a cash refund can auto-approve. */
  photoRequired: boolean;
  /** What happens when the amount exceeds the ceiling. */
  elseAction: "agent_review" | "escalate_bp";
  /** How the refundable cash amount is derived from the order. */
  amountBasis: "affected_item" | "order_total" | "partial_50" | "none";
  bpAttribution: (order: Order) => string;
}

const MATRIX: Record<IssueType, MatrixRow> = {
  missing_item_1p: {
    label: "Missing item",
    policyPath: "Missing item (1P)",
    resolutions: ["refund_original", "loyalty_points", "remake"],
    baseAutoApprove: 15,
    photoRequired: false,
    elseAction: "agent_review",
    amountBasis: "affected_item",
    bpAttribution: (o) => `Store ${o.store}`,
  },
  order_never_arrived_3p: {
    label: "Order never arrived",
    policyPath: "3P non-delivery",
    resolutions: ["refund_original", "account_credit"],
    baseAutoApprove: 25,
    photoRequired: false,
    elseAction: "escalate_bp",
    amountBasis: "order_total",
    bpAttribution: (o) => `Store ${o.store} · ${o.channel}`,
  },
  quality: {
    label: "Quality — cold / wrong cook",
    policyPath: "Quality (photo)",
    resolutions: ["refund_original", "loyalty_points"],
    baseAutoApprove: 12,
    photoRequired: true,
    elseAction: "agent_review",
    amountBasis: "partial_50",
    bpAttribution: (o) => `Store ${o.store}`,
  },
  wrong_order: {
    label: "Wrong order",
    policyPath: "Wrong order",
    resolutions: ["refund_original", "remake"],
    baseAutoApprove: 20,
    photoRequired: false,
    elseAction: "agent_review",
    amountBasis: "order_total",
    bpAttribution: (o) => `Store ${o.store}`,
  },
  late_wait: {
    label: "Late / long wait",
    policyPath: "Late / long wait (goodwill)",
    resolutions: ["loyalty_points", "discount_code"],
    baseAutoApprove: null, // points only — no cash path
    photoRequired: false,
    elseAction: "agent_review",
    amountBasis: "none",
    bpAttribution: (o) => `Store ${o.store}`,
  },
};

const METHOD_LABEL: Record<ResolutionMethod, string> = {
  refund_original: "Refund to original payment",
  account_credit: "Wingstop account credit",
  loyalty_points: "Loyalty points",
  remake: "Remake / redeliver",
  discount_code: "Discount code for next order",
};

export interface PolicyInput {
  issueType: IssueType;
  guest: Guest;
  order: Order;
  /** Names of the affected items (for missing/quality). Empty => whole order. */
  affectedItemNames?: string[];
  /** Whether a photo has been supplied (quality requires it to auto-approve). */
  photoProvided?: boolean;
}

export interface PolicyDecision {
  issueType: IssueType;
  policyPath: string;
  label: string;
  /** USD value at stake for the cash resolutions. */
  amount: number;
  /** True when the engine can resolve without a human (auto-approve). */
  autoApprove: boolean;
  /** Why a human is needed, when autoApprove is false. */
  elseAction: "agent_review" | "escalate_bp" | null;
  autoApproveLimit: number | null;
  photoRequired: boolean;
  photoSatisfied: boolean;
  bpAttribution: string;
  /** Resolution options to present to the guest, suggested one flagged. */
  options: ResolutionOption[];
  /** Plain-language rationale for the logs / agent console. */
  rationale: string;
}

function dollars(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Derive the cash amount at stake from the order + issue type. */
function computeAmount(row: MatrixRow, input: PolicyInput): number {
  const { order, affectedItemNames } = input;
  switch (row.amountBasis) {
    case "order_total":
      return dollars(order.total);
    case "partial_50":
      return dollars(order.total * 0.5);
    case "affected_item": {
      if (affectedItemNames && affectedItemNames.length) {
        const matched = order.items.filter((i) =>
          affectedItemNames.some(
            (n) => i.name.toLowerCase().includes(n.toLowerCase()) || n.toLowerCase().includes(i.name.toLowerCase()),
          ),
        );
        if (matched.length) {
          return dollars(matched.reduce((s, i) => s + i.price * i.qty, 0));
        }
      }
      // Fall back to the single most expensive line as the "missing item".
      const dearest = [...order.items].sort((a, b) => b.price - a.price)[0];
      return dollars(dearest ? dearest.price * dearest.qty : 0);
    }
    case "none":
    default:
      return 0;
  }
}

export function pointsForDollars(amount: number): number {
  // Round to the nearest 10 for a clean guest-facing number.
  return Math.round((amount * POINTS_PER_DOLLAR) / 10) * 10;
}

/**
 * Evaluate the matrix. Returns the eligible resolutions, the amount, and whether the
 * engine can auto-approve — the single source of truth both Lil Ranchie and the Call
 * Center read from.
 */
export function evaluatePolicy(input: PolicyInput): PolicyDecision {
  const row = MATRIX[input.issueType];
  const amount = computeAmount(row, input);
  const tierMult = TIER_MULTIPLIER[input.guest.tier] ?? 1;
  const autoApproveLimit =
    row.baseAutoApprove === null ? null : dollars(row.baseAutoApprove * tierMult);

  const photoSatisfied = !row.photoRequired || !!input.photoProvided;
  const claimFatigue = input.guest.priorClaims >= PRIOR_CLAIM_FATIGUE_LIMIT;

  // Auto-approve only when: there is a cash ceiling, amount is within it (after tier
  // adjustment), any required photo is present, and the guest isn't claim-fatigued.
  // Points-only paths (late_wait) always auto-approve — no money leaves the building.
  let autoApprove: boolean;
  if (row.baseAutoApprove === null) {
    autoApprove = true; // goodwill points / discount
  } else if (claimFatigue) {
    autoApprove = false;
  } else {
    autoApprove = amount <= (autoApproveLimit as number) && photoSatisfied;
  }

  const points = pointsForDollars(amount || estimateGoodwill(input));

  const options: ResolutionOption[] = row.resolutions.map((method, idx) => {
    const isCash = method === "refund_original" || method === "account_credit";
    return {
      method,
      label: METHOD_LABEL[method],
      amount: isCash ? amount : 0,
      points: method === "loyalty_points" ? points : undefined,
      // Suggest the first resolution in the matrix row (cash-first for real losses).
      suggested: idx === 0,
    };
  });

  const rationale = buildRationale(row, amount, autoApprove, autoApproveLimit, photoSatisfied, claimFatigue, input);

  return {
    issueType: input.issueType,
    policyPath: row.policyPath,
    label: row.label,
    amount,
    autoApprove,
    elseAction: autoApprove ? null : row.elseAction,
    autoApproveLimit,
    photoRequired: row.photoRequired,
    photoSatisfied,
    bpAttribution: row.bpAttribution(input.order),
    options,
    rationale,
  };
}

/** Goodwill points for points-only paths (late/wait): scaled to order size. */
function estimateGoodwill(input: PolicyInput): number {
  return Math.min(10, Math.max(4, input.order.total * 0.15));
}

function buildRationale(
  row: MatrixRow,
  amount: number,
  autoApprove: boolean,
  limit: number | null,
  photoSatisfied: boolean,
  claimFatigue: boolean,
  input: PolicyInput,
): string {
  if (row.baseAutoApprove === null) {
    return `Goodwill path — points/discount only, no cash. Auto-approved for ${input.guest.tier} member.`;
  }
  if (autoApprove) {
    return `$${amount.toFixed(2)} is within the $${(limit as number).toFixed(
      2,
    )} auto-approve ceiling for a ${input.guest.tier} member — no BP action required.`;
  }
  if (claimFatigue) {
    return `Guest has ${input.guest.priorClaims} prior claims (≥ ${PRIOR_CLAIM_FATIGUE_LIMIT}); routed to agent review per anti-abuse guardrail.`;
  }
  if (row.photoRequired && !photoSatisfied) {
    return `Quality refund requires a photo before auto-approval; none supplied — routed to agent review.`;
  }
  const action = row.elseAction === "escalate_bp" ? "escalated with BP notification" : "routed to agent review";
  return `$${amount.toFixed(2)} exceeds the $${(limit as number).toFixed(
    2,
  )} ceiling — ${action}.`;
}

export function methodLabel(method: ResolutionMethod): string {
  return METHOD_LABEL[method];
}

export function issueLabel(issueType: IssueType): string {
  return MATRIX[issueType].label;
}

/** Static view of the matrix for the design-reference table in the UI. */
export function matrixRows() {
  return (Object.keys(MATRIX) as IssueType[]).map((issueType) => {
    const row = MATRIX[issueType];
    return {
      issueType,
      label: row.label,
      resolutions: row.resolutions.map((m) => METHOD_LABEL[m]),
      autoApprove:
        row.baseAutoApprove === null ? "points only" : `≤ $${row.baseAutoApprove}`,
      photoRequired: row.photoRequired,
      elseAction: row.elseAction === "escalate_bp" ? "Escalate + BP notify" : "Agent review",
    };
  });
}
