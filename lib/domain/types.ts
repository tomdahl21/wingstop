/**
 * Wingstop GX — core domain model (PRD §11).
 *
 * One cleansed guest record links survey, chatbot, social, and 3P data; everything
 * is linkable by loyalty ID and/or email. These types are the contract shared by
 * Lil Ranchie (WS2), the policy engine, and the operational dashboards (WS1).
 */

export type LoyaltyTier = "Member" | "Silver" | "Gold" | "VIP";

export type Channel =
  | "in_app"
  | "web"
  | "sms"
  | "whatsapp"
  | "phone"
  | "doordash"
  | "uber_eats"
  | "grubhub";

export type OrderSource = "1P" | "3P";

/** The five issue types the refund matrix understands (PRD §8.4). */
export type IssueType =
  | "missing_item_1p"
  | "order_never_arrived_3p"
  | "quality"
  | "wrong_order"
  | "late_wait";

/** Resolution methods (REF-02). */
export type ResolutionMethod =
  | "refund_original"
  | "account_credit"
  | "loyalty_points"
  | "remake"
  | "discount_code";

/** Ticket lifecycle (PRD §11 / design-system status model). */
export type TicketStatus =
  | "new"
  | "in_progress"
  | "awaiting_bp"
  | "auto_resolved"
  | "escalated"
  | "resolved";

/** Refund lifecycle — money movement, governed by the policy engine. */
export type RefundStatus =
  | "eligible"
  | "pending"
  | "approved"
  | "issued"
  | "declined";

export type Sentiment = "positive" | "neutral" | "negative";

export interface Guest {
  loyaltyId: string;
  name: string;
  email: string;
  tier: LoyaltyTier;
  language: "en" | "es" | "fr";
  pointsBalance: number;
  homeStore: string; // store number
  priorClaims: number; // prior-claim frequency modifies auto-approve limits
  paymentLast4?: string;
  paymentBrand?: string;
}

export interface OrderItem {
  name: string;
  qty: number;
  price: number; // unit price in USD
}

export interface Order {
  id: string; // e.g. WS-7741
  loyaltyId: string;
  source: OrderSource;
  channel: Channel;
  store: string;
  storeName: string;
  placedAt: string; // ISO
  status: "placed" | "preparing" | "out_for_delivery" | "delivered" | "picked_up";
  items: OrderItem[];
  total: number;
}

export interface Refund {
  id: string;
  ticketId: string;
  loyaltyId: string;
  issueType: IssueType;
  policyPath: string; // human-readable matrix path used
  method: ResolutionMethod;
  amount: number; // USD (0 for points-only / discount)
  points?: number;
  status: RefundStatus;
  bpAttribution: string; // store / BP responsible
  approver: string; // "Lil Ranchie (auto)" | agent name
  createdAt: string;
}

export interface Ticket {
  id: string; // TICKET-48213
  loyaltyId: string;
  guestName: string;
  tier: LoyaltyTier;
  issueType: IssueType;
  issueLabel: string;
  channel: Channel;
  status: TicketStatus;
  store: string;
  orderId?: string;
  sentiment: Sentiment;
  slaDueAt: string; // ISO — when the SLA breaches
  owner: string; // "Lil Ranchie" | agent | "unassigned"
  refundId?: string;
  createdAt: string;
  source: "lil_ranchie" | "survey" | "phone" | "social";
}

export interface SurveyResponse {
  id: string;
  loyaltyId: string;
  orderId?: string;
  store: string;
  language: "en" | "es" | "fr";
  nps: number; // -100..100 contribution (promoter/passive/detractor)
  csat: number; // 0..100
  scores: Partial<Record<MeasuredKpi, number>>;
  sentiment: Sentiment;
  comment?: string;
  pointsAwarded: number;
  createdAt: string;
}

/** The measured CX set (PRD §4.2). */
export type MeasuredKpi =
  | "ease_of_ordering"
  | "speed"
  | "accuracy"
  | "quality"
  | "hospitality"
  | "nps"
  | "csat"
  | "ces";

export interface SentimentRecord {
  id: string;
  source: "survey" | "social" | "review" | "chat";
  channel: string; // X, Google, Reddit, Instagram, app chat...
  store?: string;
  language: string;
  sentiment: Sentiment;
  text: string;
  createdAt: string;
}

/* ---- Lil Ranchie conversation: structured message blocks (CONV-01..03) ---- */

export interface QuickReply {
  label: string;
  value: string;
}

export interface ResolutionOption {
  method: ResolutionMethod;
  label: string;
  amount: number; // USD
  points?: number;
  suggested: boolean;
}

export type MessageBlock =
  | { type: "text"; text: string; fallback: string }
  | { type: "quick_replies"; prompt: string; options: QuickReply[]; fallback: string }
  | {
      type: "order_status";
      title: string;
      order: { id: string; placedAt: string; store: string; lines: { label: string; value: string }[] };
      fallback: string;
    }
  | {
      type: "resolution_options";
      title: string;
      options: ResolutionOption[];
      fallback: string;
    }
  | {
      type: "confirmation";
      title: string;
      lines: { label: string; value: string }[];
      ticketId: string;
      fallback: string;
    }
  | { type: "handoff"; reason: string; ticketId?: string; fallback: string }
  | { type: "faq_link"; title: string; url: string; fallback: string };

export type ChatRole = "guest" | "ranchie";

export interface ChatTurn {
  role: ChatRole;
  blocks: MessageBlock[];
}
