/**
 * In-memory data spine (PRD §9 closed loop, LOOP-01..04).
 *
 * A single cleansed guest record links survey, chatbot, social, and 3P data. This module
 * is the shared store every surface reads from: Lil Ranchie writes a ticket + refund +
 * sentiment when it resolves an issue, and those same records light up the GX Command
 * Center and the Call Center Refund Queue in real time. Feedback in, resolution out,
 * every interaction feeds the next.
 *
 * Backed by a process-global singleton so it survives Next.js hot-reloads and is shared
 * across API routes and server components within one running server.
 */

import {
  evaluatePolicy,
  issueLabel,
  type PolicyDecision,
} from "./policy";
import type {
  Guest,
  IssueType,
  Order,
  Refund,
  RefundStatus,
  ResolutionMethod,
  SentimentRecord,
  Sentiment,
  SurveyResponse,
  Ticket,
} from "./types";

interface GxStore {
  guests: Map<string, Guest>;
  orders: Map<string, Order>;
  tickets: Ticket[];
  refunds: Refund[];
  surveys: SurveyResponse[];
  sentiment: SentimentRecord[];
  counters: { ticket: number; refund: number; survey: number; sentiment: number };
}

function iso(daysAgoMinutes = 0): string {
  return new Date(Date.now() - daysAgoMinutes * 60_000).toISOString();
}

function seed(): GxStore {
  const guests = new Map<string, Guest>();
  const orders = new Map<string, Order>();

  const maya: Guest = {
    loyaltyId: "WR-100145",
    name: "Maya Alvarez",
    email: "maya.alvarez@example.com",
    tier: "Gold",
    language: "en",
    pointsBalance: 1840,
    homeStore: "0145",
    priorClaims: 1,
    paymentLast4: "4821",
    paymentBrand: "Visa",
  };
  const park: Guest = {
    loyaltyId: "WR-100219",
    name: "Jordan Park",
    email: "j.park@example.com",
    tier: "Member",
    language: "en",
    pointsBalance: 410,
    homeStore: "2231",
    priorClaims: 0,
    paymentLast4: "1190",
    paymentBrand: "Mastercard",
  };
  const nguyen: Guest = {
    loyaltyId: "WR-100224",
    name: "Tran Nguyen",
    email: "t.nguyen@example.com",
    tier: "VIP",
    language: "en",
    pointsBalance: 6120,
    homeStore: "0145",
    priorClaims: 2,
    paymentLast4: "7733",
    paymentBrand: "Amex",
  };
  const diaz: Guest = {
    loyaltyId: "WR-100230",
    name: "Rosa Diaz",
    email: "r.diaz@example.com",
    tier: "Silver",
    language: "es",
    pointsBalance: 980,
    homeStore: "0145",
    priorClaims: 0,
    paymentLast4: "5567",
    paymentBrand: "Visa",
  };
  for (const g of [maya, park, nguyen, diaz]) guests.set(g.loyaltyId, g);

  const mayaOrder: Order = {
    id: "WS-7741",
    loyaltyId: maya.loyaltyId,
    source: "1P",
    channel: "in_app",
    store: "0145",
    storeName: "Lemmon Ave",
    placedAt: iso(72),
    status: "delivered",
    items: [
      { name: "20 PC Boneless Group Pack", qty: 1, price: 21.49 },
      { name: "10 PC Lemon Pepper", qty: 1, price: 8.49 },
      { name: "Large Fries", qty: 2, price: 4.29 },
      { name: "Ranch Dip", qty: 3, price: 0.89 },
    ],
    total: 41.74,
  };
  const parkOrder: Order = {
    id: "WS-7820",
    loyaltyId: park.loyaltyId,
    source: "3P",
    channel: "doordash",
    store: "2231",
    storeName: "Preston Rd",
    placedAt: iso(95),
    status: "out_for_delivery",
    items: [
      { name: "8 PC Classic Combo", qty: 1, price: 12.49 },
      { name: "Cajun Fried Corn", qty: 1, price: 3.99 },
    ],
    total: 18.4,
  };
  const nguyenOrder: Order = {
    id: "WS-7833",
    loyaltyId: nguyen.loyaltyId,
    source: "1P",
    channel: "in_app",
    store: "0145",
    storeName: "Lemmon Ave",
    placedAt: iso(40),
    status: "delivered",
    items: [
      { name: "10 PC Hot Honey Rub", qty: 1, price: 9.99 },
      { name: "Seasoned Fries", qty: 1, price: 3.49 },
    ],
    total: 13.48,
  };
  const diazOrder: Order = {
    id: "WS-7841",
    loyaltyId: diaz.loyaltyId,
    source: "1P",
    channel: "in_app",
    store: "0145",
    storeName: "Lemmon Ave",
    placedAt: iso(30),
    status: "picked_up",
    items: [
      { name: "16 PC Family Pack", qty: 1, price: 18.99 },
      { name: "Large Fries", qty: 1, price: 4.29 },
    ],
    total: 23.28,
  };
  for (const o of [mayaOrder, parkOrder, nguyenOrder, diazOrder]) orders.set(o.id, o);

  // Seed an open queue so the operational surfaces have content before any chat runs.
  const tickets: Ticket[] = [
    {
      // Pre-emptive recovery (the loop running forward): the store was out of bottled
      // water, so Lil Ranchie made it right before the guest noticed — a would-be refund
      // call logged instead as an auto-resolved, positive-sentiment event.
      id: "TICKET-48228",
      loyaltyId: maya.loyaltyId,
      guestName: maya.name,
      tier: maya.tier,
      issueType: "missing_item_1p",
      issueLabel: "Store stockout — bottled water (pre-empted)",
      channel: "in_app",
      status: "auto_resolved",
      store: "0145",
      orderId: mayaOrder.id,
      sentiment: "positive",
      slaDueAt: iso(0),
      owner: "Lil Ranchie (auto)",
      refundId: "REF-9128",
      createdAt: iso(8),
      source: "lil_ranchie",
    },
    {
      id: "TICKET-48219",
      loyaltyId: park.loyaltyId,
      guestName: park.name,
      tier: park.tier,
      issueType: "order_never_arrived_3p",
      issueLabel: issueLabel("order_never_arrived_3p"),
      channel: "doordash",
      status: "escalated",
      store: "2231",
      orderId: parkOrder.id,
      sentiment: "negative",
      slaDueAt: iso(-25),
      owner: "Social Care",
      refundId: "REF-9119",
      createdAt: iso(46),
      source: "lil_ranchie",
    },
    {
      id: "TICKET-48224",
      loyaltyId: nguyen.loyaltyId,
      guestName: nguyen.name,
      tier: nguyen.tier,
      issueType: "quality",
      issueLabel: issueLabel("quality"),
      channel: "in_app",
      status: "in_progress",
      store: "0145",
      orderId: nguyenOrder.id,
      sentiment: "negative",
      slaDueAt: iso(-90),
      owner: "MCI · A. Reyes",
      refundId: "REF-9124",
      createdAt: iso(38),
      source: "lil_ranchie",
    },
    {
      id: "TICKET-48230",
      loyaltyId: diaz.loyaltyId,
      guestName: diaz.name,
      tier: diaz.tier,
      issueType: "wrong_order",
      issueLabel: issueLabel("wrong_order"),
      channel: "phone",
      status: "resolved",
      store: "0145",
      orderId: diazOrder.id,
      sentiment: "neutral",
      slaDueAt: iso(-200),
      owner: "MCI · A. Reyes",
      refundId: "REF-9130",
      createdAt: iso(120),
      source: "phone",
    },
  ];

  const refunds: Refund[] = [
    {
      id: "REF-9128",
      ticketId: "TICKET-48228",
      loyaltyId: maya.loyaltyId,
      issueType: "missing_item_1p",
      policyPath: "Pre-emptive · store stockout",
      method: "refund_original",
      amount: 1.29,
      status: "issued",
      bpAttribution: "Store 0145",
      approver: "Lil Ranchie (auto)",
      createdAt: iso(8),
    },
    {
      id: "REF-9119",
      ticketId: "TICKET-48219",
      loyaltyId: park.loyaltyId,
      issueType: "order_never_arrived_3p",
      policyPath: "3P non-delivery",
      method: "refund_original",
      amount: 18.4,
      status: "pending",
      bpAttribution: "Store 2231 · doordash",
      approver: "—",
      createdAt: iso(46),
    },
    {
      id: "REF-9124",
      ticketId: "TICKET-48224",
      loyaltyId: nguyen.loyaltyId,
      issueType: "quality",
      policyPath: "Quality (photo)",
      method: "refund_original",
      amount: 6.74,
      status: "eligible",
      bpAttribution: "Store 0145",
      approver: "—",
      createdAt: iso(38),
    },
    {
      id: "REF-9130",
      ticketId: "TICKET-48230",
      loyaltyId: diaz.loyaltyId,
      issueType: "wrong_order",
      policyPath: "Wrong order",
      method: "refund_original",
      amount: 23.28,
      status: "issued",
      bpAttribution: "Store 0145",
      approver: "MCI · A. Reyes",
      createdAt: iso(120),
    },
  ];

  const sentiment: SentimentRecord[] = [
    {
      id: "SENT-1",
      source: "social",
      channel: "X",
      store: "2231",
      language: "en",
      sentiment: "negative",
      text: "waited 40 min for a togo order…",
      createdAt: iso(12),
    },
    {
      id: "SENT-2",
      source: "review",
      channel: "Google",
      store: "0145",
      language: "en",
      sentiment: "positive",
      text: "best lemon pepper in the city",
      createdAt: iso(31),
    },
    {
      id: "SENT-3",
      source: "social",
      channel: "Reddit",
      language: "en",
      sentiment: "neutral",
      text: "do they still have the ranch deal?",
      createdAt: iso(60),
    },
    {
      id: "SENT-4",
      source: "social",
      channel: "Instagram",
      store: "0145",
      language: "es",
      sentiment: "positive",
      text: "las alitas de limón con pimienta son lo máximo 🔥",
      createdAt: iso(80),
    },
  ];

  const surveys: SurveyResponse[] = [
    {
      id: "SVY-1",
      loyaltyId: nguyen.loyaltyId,
      orderId: nguyenOrder.id,
      store: "0145",
      language: "en",
      nps: 30,
      csat: 72,
      scores: { speed: 80, accuracy: 70, quality: 55, hospitality: 60 },
      sentiment: "neutral",
      comment: "Wings were a little cold but the fix was fast.",
      pointsAwarded: 50,
      createdAt: iso(20),
    },
  ];

  return {
    guests,
    orders,
    tickets,
    refunds,
    surveys,
    sentiment,
    counters: { ticket: 48230, refund: 9130, survey: 1, sentiment: 4 },
  };
}

/** Process-global singleton (survives hot reloads in dev). */
const globalForGx = globalThis as unknown as { __gxStore?: GxStore };
const store: GxStore = globalForGx.__gxStore ?? (globalForGx.__gxStore = seed());

/* -------------------------------- reads -------------------------------- */

export function getGuest(loyaltyId: string): Guest | undefined {
  return store.guests.get(loyaltyId);
}

export function getOrder(orderId: string): Order | undefined {
  return store.orders.get(orderId);
}

/** Resolve a guest's most recent order — identity is assumed, never re-requested (CONV-06). */
export function latestOrderForGuest(loyaltyId: string): Order | undefined {
  return [...store.orders.values()]
    .filter((o) => o.loyaltyId === loyaltyId)
    .sort((a, b) => +new Date(b.placedAt) - +new Date(a.placedAt))[0];
}

export function listTickets(): Ticket[] {
  return [...store.tickets].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function getTicket(id: string): Ticket | undefined {
  return store.tickets.find((t) => t.id === id);
}

export function listRefunds(): Refund[] {
  return [...store.refunds].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function getRefund(id: string): Refund | undefined {
  return store.refunds.find((r) => r.id === id);
}

export function listSentiment(): SentimentRecord[] {
  return [...store.sentiment].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function listSurveys(): SurveyResponse[] {
  return [...store.surveys].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

/* ------------------------------ mutations ------------------------------ */

const SLA_MINUTES: Record<Ticket["status"], number> = {
  new: 60,
  in_progress: 120,
  awaiting_bp: 240,
  auto_resolved: 0,
  escalated: 30,
  resolved: 0,
};

function nextTicketId(): string {
  store.counters.ticket += 1;
  return `TICKET-${store.counters.ticket}`;
}
function nextRefundId(): string {
  store.counters.refund += 1;
  return `REF-${store.counters.refund}`;
}

export interface RecordResolutionInput {
  guest: Guest;
  order: Order;
  decision: PolicyDecision;
  method: ResolutionMethod;
  channel: Ticket["channel"];
}

export interface RecordResolutionResult {
  ticket: Ticket;
  refund?: Refund;
  pointsAdded?: number;
  newPointsBalance?: number;
}

/**
 * The closed-loop write (LOOP-03/04): a guest resolution becomes a ticket + (optional)
 * refund + sentiment record, all linked by loyalty ID, instantly visible to GX and the
 * Call Center. Money fields come straight from the deterministic decision — never the model.
 */
export function recordResolution(input: RecordResolutionInput): RecordResolutionResult {
  const { guest, order, decision, method, channel } = input;
  const option = decision.options.find((o) => o.method === method) ?? decision.options[0];

  const isCash = method === "refund_original" || method === "account_credit";
  const ticketId = nextTicketId();
  const createdAt = new Date().toISOString();

  // Ticket status follows the matrix: cash within ceiling => auto-resolved; otherwise
  // the appropriate human path. Points/remake are always self-serve auto-resolved.
  let status: Ticket["status"];
  if (!isCash) {
    status = "auto_resolved";
  } else if (decision.autoApprove) {
    status = "auto_resolved";
  } else if (decision.elseAction === "escalate_bp") {
    status = "escalated";
  } else {
    status = "awaiting_bp";
  }

  const owner = status === "auto_resolved" ? "Lil Ranchie (auto)" : "MCI queue";

  let refund: Refund | undefined;
  if (isCash) {
    const refundStatus: RefundStatus = decision.autoApprove ? "issued" : "pending";
    refund = {
      id: nextRefundId(),
      ticketId,
      loyaltyId: guest.loyaltyId,
      issueType: decision.issueType,
      policyPath: decision.policyPath,
      method,
      amount: option.amount,
      status: refundStatus,
      bpAttribution: decision.bpAttribution,
      approver: decision.autoApprove ? "Lil Ranchie (auto)" : "—",
      createdAt,
    };
    store.refunds.push(refund);
  }

  let pointsAdded: number | undefined;
  let newPointsBalance: number | undefined;
  if (method === "loyalty_points" && option.points) {
    pointsAdded = option.points;
    guest.pointsBalance += option.points;
    newPointsBalance = guest.pointsBalance;
  }

  const ticket: Ticket = {
    id: ticketId,
    loyaltyId: guest.loyaltyId,
    guestName: guest.name,
    tier: guest.tier,
    issueType: decision.issueType,
    issueLabel: decision.label,
    channel,
    status,
    store: order.store,
    orderId: order.id,
    sentiment: status === "auto_resolved" ? "positive" : "negative",
    slaDueAt: new Date(Date.now() + (SLA_MINUTES[status] || 60) * 60_000).toISOString(),
    owner,
    refundId: refund?.id,
    createdAt,
    source: channel === "phone" ? "phone" : "lil_ranchie",
  };
  store.tickets.push(ticket);

  // Every chat session logs sentiment back to WS1 (GP5).
  store.counters.sentiment += 1;
  store.sentiment.push({
    id: `SENT-${store.counters.sentiment}`,
    source: "chat",
    channel: "Lil Ranchie",
    store: order.store,
    language: guest.language,
    sentiment: ticket.sentiment,
    text:
      status === "auto_resolved"
        ? `${decision.label} resolved in-app for ${guest.name} (${guest.tier})`
        : `${decision.label} escalated to a human for ${guest.name} (${guest.tier})`,
    createdAt,
  });

  return { ticket, refund, pointsAdded, newPointsBalance };
}

/** Open a human-handoff ticket carrying full context (GP3 / BOT-06). */
export function recordHandoff(
  guest: Guest,
  order: Order | undefined,
  reason: string,
  channel: Ticket["channel"],
): Ticket {
  const ticketId = nextTicketId();
  const createdAt = new Date().toISOString();
  const ticket: Ticket = {
    id: ticketId,
    loyaltyId: guest.loyaltyId,
    guestName: guest.name,
    tier: guest.tier,
    issueType: "missing_item_1p",
    issueLabel: "Human handoff",
    channel,
    status: "in_progress",
    store: order?.store ?? guest.homeStore,
    orderId: order?.id,
    sentiment: "neutral",
    slaDueAt: new Date(Date.now() + 30 * 60_000).toISOString(),
    owner: "MCI queue",
    createdAt,
    source: "lil_ranchie",
  };
  store.tickets.push(ticket);
  return ticket;
}

/**
 * Pre-emptive recovery — the loop running forward (the TD R1 centerpiece). The operation
 * knows about a shortfall (here: the store ran out of bottled water) and Lil Ranchie makes
 * it right before the guest notices, converting a would-be refund call into an auto-resolved,
 * positive-sentiment event. Returns the logged ticket so the front-stage can show it landing
 * in the dashboards in real time.
 */
export function recordPreemptiveRecovery(loyaltyId: string = "WR-100145"): { ticket: Ticket; refund: Refund } {
  const guest = store.guests.get(loyaltyId);
  const order = guest ? latestOrderForGuest(loyaltyId) : undefined;
  const createdAt = new Date().toISOString();
  const ticketId = nextTicketId();
  const refundId = nextRefundId();
  const name = guest?.name ?? "Guest";
  const tier = guest?.tier ?? "Member";
  const store_ = order?.store ?? guest?.homeStore ?? "0145";

  const refund: Refund = {
    id: refundId,
    ticketId,
    loyaltyId,
    issueType: "missing_item_1p",
    policyPath: "Pre-emptive · store stockout",
    method: "refund_original",
    amount: 1.29,
    status: "issued",
    bpAttribution: `Store ${store_}`,
    approver: "Lil Ranchie (auto)",
    createdAt,
  };
  store.refunds.push(refund);

  if (guest) guest.pointsBalance += 200;

  const ticket: Ticket = {
    id: ticketId,
    loyaltyId,
    guestName: name,
    tier,
    issueType: "missing_item_1p",
    issueLabel: "Store stockout — bottled water (pre-empted)",
    channel: "in_app",
    status: "auto_resolved",
    store: store_,
    orderId: order?.id,
    sentiment: "positive",
    slaDueAt: createdAt,
    owner: "Lil Ranchie (auto)",
    refundId,
    createdAt,
    source: "lil_ranchie",
  };
  store.tickets.push(ticket);

  store.counters.sentiment += 1;
  store.sentiment.push({
    id: `SENT-${store.counters.sentiment}`,
    source: "chat",
    channel: "Lil Ranchie",
    store: store_,
    language: guest?.language ?? "en",
    sentiment: "positive",
    text: `Pre-emptive recovery — store out of bottled water, auto-credited ${name} before delivery`,
    createdAt,
  });

  return { ticket, refund };
}

/** Agent action in the Refund Queue — approve & issue, enforcing the policy path. */
export function approveRefund(refundId: string, approver: string): Refund | undefined {
  const refund = store.refunds.find((r) => r.id === refundId);
  if (!refund) return undefined;
  refund.status = "issued";
  refund.approver = approver;
  const ticket = store.tickets.find((t) => t.id === refund.ticketId);
  if (ticket) {
    ticket.status = "resolved";
    ticket.sentiment = "positive";
  }
  return refund;
}

export function declineRefund(refundId: string, approver: string): Refund | undefined {
  const refund = store.refunds.find((r) => r.id === refundId);
  if (!refund) return undefined;
  refund.status = "declined";
  refund.approver = approver;
  const ticket = store.tickets.find((t) => t.id === refund.ticketId);
  if (ticket) ticket.status = "escalated";
  return refund;
}

/** Submit a post-resolution survey (WS1) — short, incentivized, loyalty-linked. */
export function submitSurvey(input: {
  loyaltyId: string;
  orderId?: string;
  store: string;
  language: "en" | "es" | "fr";
  rating: number; // 1..5
  comment?: string;
}): SurveyResponse {
  store.counters.survey += 1;
  const guest = store.guests.get(input.loyaltyId);
  const nps = input.rating >= 5 ? 100 : input.rating >= 4 ? 0 : -100;
  const sentiment: Sentiment =
    input.rating >= 4 ? "positive" : input.rating === 3 ? "neutral" : "negative";
  const survey: SurveyResponse = {
    id: `SVY-${store.counters.survey}`,
    loyaltyId: input.loyaltyId,
    orderId: input.orderId,
    store: input.store,
    language: input.language,
    nps,
    csat: input.rating * 20,
    scores: {},
    sentiment,
    comment: input.comment,
    pointsAwarded: 50,
    createdAt: new Date().toISOString(),
  };
  store.surveys.push(survey);
  if (guest) guest.pointsBalance += 50;
  return survey;
}

/* ------------------------- derived dashboard data ------------------------- */

export interface DashboardKpis {
  nps: number;
  csat: number;
  deflectionRate: number;
  openIssues: number;
  hospitality: number;
  accuracy: number;
}

export function dashboardKpis(): DashboardKpis {
  const open = store.tickets.filter(
    (t) => t.status !== "resolved" && t.status !== "auto_resolved",
  ).length;
  const auto = store.tickets.filter((t) => t.status === "auto_resolved").length;
  const total = store.tickets.length || 1;
  // Baseline program numbers blended with live ticket mix (illustrative, per design system).
  const deflection = Math.round(58 + (auto / total) * 12);
  return {
    nps: 42,
    csat: 88,
    deflectionRate: Math.min(deflection, 72),
    openIssues: 290 + open,
    hospitality: 76,
    accuracy: 91,
  };
}

export interface CategoryBar {
  label: string;
  count: number;
  tone: "neg" | "neu" | "gold" | "crave";
}

export function issuesByCategory(): CategoryBar[] {
  // Baseline portfolio volumes + live ticket increments (closed loop reflected here).
  const base: Record<IssueType, { label: string; count: number; tone: CategoryBar["tone"] }> = {
    missing_item_1p: { label: "Missing item", count: 1204, tone: "neg" },
    wrong_order: { label: "Order accuracy", count: 938, tone: "neu" },
    late_wait: { label: "Wait time", count: 701, tone: "neu" },
    quality: { label: "Food quality", count: 540, tone: "gold" },
    order_never_arrived_3p: { label: "Never arrived (3P)", count: 308, tone: "crave" },
  };
  for (const t of store.tickets) base[t.issueType].count += 1;
  return (Object.keys(base) as IssueType[])
    .map((k) => base[k])
    .sort((a, b) => b.count - a.count);
}

/** Re-export the engine so a single import surface drives all the surfaces. */
export { evaluatePolicy };
