/**
 * Ordering channels, quantified.
 *
 * The engagement strategy needs a decision rule for *where* to meet customers. You get it by
 * measuring every ordering channel on two axes:
 *   1. what the customer actually comes there for (their want), and
 *   2. who owns the relationship and what it costs to serve.
 *
 * The move is never "force everyone to 1P." It's: make the owned channel the better answer to
 * what the customer already wanted, then move them there deliberately — grow it, convert off
 * the rented channel, deflect the expensive one, or hold and capture identity.
 *
 * Shares sum to 100. Illustrative, in the spirit of the TD R1 current-state and Wingstop's
 * publicly digital-heavy mix — directional, not a reported figure.
 */

export type ChannelOwner = "wingstop" | "platform";
export type ChannelMove = "grow" | "convert" | "deflect" | "hold";

export interface OrderChannel {
  id: string;
  label: string;
  kind: string;
  /** Share of orders, %. Sums to 100 across channels. */
  share: number;
  /** Cost / take-rate descriptor. */
  cost: string;
  /** Who owns the customer relationship on this channel. */
  owner: ChannelOwner;
  /** What the customer comes to this channel for. */
  wants: string;
  /** The deliberate decision for this channel. */
  move: ChannelMove;
  moveNote: string;
}

export const CHANNELS: OrderChannel[] = [
  {
    id: "app_1p",
    label: "Wingstop app",
    kind: "1P digital",
    share: 38,
    cost: "~3% processing",
    owner: "wingstop",
    wants: "Speed, saved order, points",
    move: "grow",
    moveNote: "Best economics and the only channel Wingstop fully owns. Don't just push volume here — enhance the experience so it earns the default, and every added customer lands on the best-served channel.",
  },
  {
    id: "web_1p",
    label: "Wingstop.com",
    kind: "1P digital",
    share: 20,
    cost: "~3% processing",
    owner: "wingstop",
    wants: "Desktop, group orders, first-timers",
    move: "hold",
    moveNote: "Owned and solid. Use it to feed app adoption on the next order.",
  },
  {
    id: "marketplace_3p",
    label: "DoorDash / Uber Eats",
    kind: "3P marketplace",
    share: 29,
    cost: "20–30% commission",
    owner: "platform",
    wants: "Discovery, delivery, one app for everything",
    move: "convert",
    moveNote: "You rent the customer here. Meet the delivery demand on your own rails and earn the second order direct.",
  },
  {
    id: "phone",
    label: "Phone",
    kind: "Voice",
    share: 8,
    cost: "High labor cost",
    owner: "wingstop",
    wants: "Complex orders, problems, no-app customers",
    move: "deflect",
    moveNote: "Owned but expensive. Route routine calls to Ranchie; keep the human for what needs one.",
  },
  {
    id: "in_store",
    label: "In-store / kiosk",
    kind: "Counter",
    share: 5,
    cost: "Counter labor",
    owner: "wingstop",
    wants: "Walk-ins, pay-at-counter",
    move: "hold",
    moveNote: "Capture the identity at the counter so the next order can be digital.",
  },
];

/** Share of orders on channels Wingstop owns the relationship on. */
export const OWNED_SHARE = CHANNELS.filter((c) => c.owner === "wingstop").reduce((s, c) => s + c.share, 0);

/** Share of orders rented from a third-party platform. */
export const RENTED_SHARE = CHANNELS.filter((c) => c.owner === "platform").reduce((s, c) => s + c.share, 0);

export const MOVE_META: Record<ChannelMove, { label: string; glyph: string }> = {
  grow: { label: "Grow & enhance", glyph: "↑" },
  convert: { label: "Convert", glyph: "→" },
  deflect: { label: "Deflect", glyph: "↓" },
  hold: { label: "Hold", glyph: "•" },
};
