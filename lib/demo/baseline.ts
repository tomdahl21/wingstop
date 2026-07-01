/**
 * The investment thesis, quantified.
 *
 * "Customer experience could look like this → which means Ranchie could look like that →
 *  which means this is your NPS & insights baseline, IF you make meaningful, intentional
 *  investments."
 *
 * This module models that causal chain. Each intentional investment in the front-stage
 * experience has modeled downstream effects on issue management (deflection, call volume)
 * and on the insights baseline (NPS, CSAT, sentiment, survey response). Toggle the
 * investments and the global baseline recomputes — that's the whole argument made tangible.
 *
 * Numbers are illustrative (per the design system's reference figures), tuned so that
 * "today" reflects the real TD R1 current-state and "all investments on" lands at the
 * aspirational baseline (NPS +42 / CSAT 88 / 61% deflection).
 */

export type Stage = "order" | "track" | "resolve" | "insight";

export interface Investment {
  id: string;
  label: string;
  stage: Stage;
  /** The real gap from the TD R1 research this addresses. */
  fixes: string;
  /** Modeled downstream deltas applied when this investment is switched on. */
  effects: {
    nps?: number; // +points
    csat?: number; // +pp
    deflection?: number; // +pp
    callVolume?: number; // index delta, negative = fewer calls (% change)
    sentiment?: number; // +pp positive
    responseRate?: number; // +pp survey response
  };
}

export interface Baseline {
  nps: number;
  csat: number;
  deflection: number;
  callVolume: number; // index, 100 = today's volume
  sentiment: number; // % positive
  responseRate: number; // % survey completion
}

/** Current state — the experience captured in the TD R1 session. */
export const TODAY: Baseline = {
  nps: 8,
  csat: 71,
  deflection: 0,
  callVolume: 100,
  sentiment: 48,
  responseRate: 6,
};

export const INVESTMENTS: Investment[] = [
  {
    id: "relationship_at_order",
    label: "Lil Ranchie + loyalty at the order",
    stage: "order",
    fixes: "Today the assistant is never introduced while ordering, so it's a stranger at the hiccup. Ranch — the signature asset and the mascot — is never a branded moment.",
    effects: { nps: 6, csat: 3, deflection: 5, callVolume: -6, sentiment: 5, responseRate: 4 },
  },
  {
    id: "channel_transparency",
    label: "Channel transparency",
    stage: "order",
    fixes: "Guests don't know the app defaults to DoorDash fulfillment, so they don't know who owns a problem when one comes up.",
    effects: { nps: 3, csat: 2, deflection: 4, callVolume: -7, sentiment: 2 },
  },
  {
    id: "clean_offers_loyalty",
    label: "Clean offers + instant points",
    stage: "order",
    fixes: "The welcome gift showed 'applied' and 'not valid' at once; the total silently shifted; earned points post in 72 hours.",
    effects: { nps: 3, csat: 2, sentiment: 3, responseRate: 3 },
  },
  {
    id: "unified_tracking",
    label: "Unified in-app tracking",
    stage: "track",
    fixes: "The embedded DoorDash tracker dead-ends in a Cloudflare 'verify you are human' CAPTCHA — guests can't track their order in the app.",
    effects: { nps: 5, csat: 3, deflection: 12, callVolume: -13, sentiment: 4 },
  },
  {
    id: "preemptive_recovery",
    label: "Pre-emptive recovery",
    stage: "track",
    fixes: "The operation knew the store was out of bottled water; the DoorDash driver did the recovery. Wingstop never owned it. Fix it before the guest notices.",
    effects: { nps: 7, csat: 3, deflection: 19, callVolume: -10, sentiment: 5 },
  },
  {
    id: "policy_resolution",
    label: "Policy-enforced resolution",
    stage: "resolve",
    fixes: "A missing water bottle had zero in-app path to resolve. Deterministic, on-the-spot make-it-right with no BP veto.",
    effects: { nps: 5, csat: 2, deflection: 21, callVolume: -9, sentiment: 3 },
  },
  {
    id: "closed_loop_survey",
    label: "Closed-loop survey",
    stage: "insight",
    fixes: "A sealed bag, no receipt, no short survey — feedback dead-ends and the insights baseline stays blind.",
    effects: { nps: 5, csat: 2, sentiment: 2, responseRate: 5 },
  },
];

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/** Compute the resulting insights baseline from the set of enabled investments. */
export function computeBaseline(enabled: Set<string> | string[]): Baseline {
  const on = enabled instanceof Set ? enabled : new Set(enabled);
  const b: Baseline = { ...TODAY };
  for (const inv of INVESTMENTS) {
    if (!on.has(inv.id)) continue;
    const e = inv.effects;
    b.nps += e.nps ?? 0;
    b.csat += e.csat ?? 0;
    b.deflection += e.deflection ?? 0;
    b.callVolume += e.callVolume ?? 0;
    b.sentiment += e.sentiment ?? 0;
    b.responseRate += e.responseRate ?? 0;
  }
  return {
    nps: clamp(Math.round(b.nps), -100, 100),
    csat: clamp(Math.round(b.csat), 0, 100),
    deflection: clamp(Math.round(b.deflection), 0, 100),
    callVolume: clamp(Math.round(b.callVolume), 0, 200),
    sentiment: clamp(Math.round(b.sentiment), 0, 100),
    responseRate: clamp(Math.round(b.responseRate), 0, 100),
  };
}

export const ALL_INVESTMENT_IDS = INVESTMENTS.map((i) => i.id);

/** The aspirational baseline with every investment made. */
export const FUTURE_STATE = computeBaseline(ALL_INVESTMENT_IDS);

/** Survey response as a multiple of today (the design system framed it as "3×"). */
export function responseMultiple(b: Baseline): number {
  return Math.round((b.responseRate / TODAY.responseRate) * 10) / 10;
}

/** Call-volume change as a percentage (negative = reduction). */
export function callVolumeChangePct(b: Baseline): number {
  return Math.round(b.callVolume - 100);
}
