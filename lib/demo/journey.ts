/**
 * The future-state order experience, scene by scene.
 *
 * "The customer experience could look like this" — a guided walk through the re-imagined
 * Wingstop order, where Lil Ranchie (the ranch) is the connective thread from the first tap
 * to being heard. Each scene names the real TD R1 gap it closes and the downstream
 * consequence ("which means…"). Voice is Wingstop: bold, flavor-forward, the wing experts —
 * and Ranchie talks like the ranch it is, not a generic assistant.
 */

import type { Stage } from "./baseline";

export interface PhoneBubble {
  from: "ranchie" | "guest";
  text: string;
  /** BCP-47 lang for a non-English bubble (native rendering, not a translation overlay). */
  lang?: string;
}

export type DemoCard =
  | { kind: "menu"; title: string; combos: string[]; portion: string; price: string }
  | { kind: "summary"; lines: { label: string; value: string; tone?: "good" | "muted" }[]; total: string; note: string }
  | {
      kind: "confirm";
      orderNo: string;
      eta: string;
      items: { name: string; qty: number }[];
    }
  | { kind: "tracker"; step: number; eta: string; sub: string }
  | { kind: "preempt"; title: string; lines: { label: string; value: string }[] }
  | { kind: "survey"; prompt: string; reward: string; lang?: string };

export interface Scene {
  id: string;
  stage: Stage;
  headline: string;
  narration: string;
  /** The real TD R1 gap this scene closes. */
  fixes: string;
  appBar: string;
  bubbles: PhoneBubble[];
  card?: DemoCard;
  whichMeans: { metric: string; effect: string };
  /** Scenes that trigger the live forward-loop write (pre-emptive recovery). */
  triggersPreempt?: boolean;
  /** Operational precondition to confront out loud (turns a demo weakness into credibility). */
  precondition?: string;
}

export const SCENES: Scene[] = [
  {
    id: "recognized",
    stage: "order",
    headline: "Recognized from the first tap",
    narration:
      "Ranch isn't a dip choice buried in the flow — it's the brand, and it's the assistant. Lil Ranchie opens the order as a known ally, established at the top of the funnel where it can actually do work later.",
    fixes:
      "In the real session ranch was never a branded thing, and the assistant is never introduced while ordering — so it's a stranger the moment something breaks.",
    appBar: "Lil Ranchie",
    bubbles: [
      { from: "ranchie", text: "It's Ranchie — your ranch, on speed-dial. Game night again? Same 20pc boneless, extra ranch (obviously)?" },
      { from: "guest", text: "you know it" },
      { from: "ranchie", text: "Say less. You're 90 points from a free side too — I'll keep an eye on it." },
    ],
    whichMeans: { metric: "Identity + loyalty established at the order", effect: "every later touch already knows who you are" },
  },
  {
    id: "pair",
    stage: "order",
    headline: "Pairings from the wing experts",
    narration:
      "Wingstop has a dozen flavors and the app never helps you combine them. Ranchie does — by real flavor name — and frames value the way Wingstop actually should: by how much it feeds, not the dollar.",
    fixes:
      "No pairing guidance anywhere, and '$28 for 5 strips' didn't read like $28 — nothing frames value vs. fullness, so guests over-order.",
    appBar: "Build your order",
    bubbles: [
      {
        from: "ranchie",
        text: "Lemon Pepper + ranch is the move for a group. Want heat? Mango Habanero. Feeding folks who won't do spicy? Garlic Parm.",
      },
      { from: "ranchie", text: "This pack's about 4 wings a head — enough for the first half. Add a second pack for the fourth quarter, or we're good?" },
    ],
    card: {
      kind: "menu",
      title: "20 PC Boneless Group Pack",
      combos: ["Lemon Pepper + Ranch", "Mango Habanero (heat)", "Garlic Parm (no spice)"],
      portion: "~4 wings a head · covers 5 for the first half",
      price: "$21.49",
    },
    whichMeans: { metric: "Right-sized, expert-paired order", effect: "fewer 'didn't feel worth it' regrets → higher sentiment" },
  },
  {
    id: "checkout",
    stage: "order",
    headline: "An honest checkout",
    narration:
      "The welcome gift applies cleanly, the price is the price, and the app says plainly who's delivering — and that Wingstop, not DoorDash, owns whatever happens next.",
    fixes:
      "The real order showed 'gift applied' and 'offer not valid' at once, the total silently dropped $0.50, points posted in 72 hours, and nothing said it was a DoorDash delivery.",
    appBar: "Review order",
    bubbles: [],
    card: {
      kind: "summary",
      lines: [
        { label: "Welcome gift: 5 free boneless", value: "−$5.00 applied", tone: "good" },
        { label: "Delivered by DoorDash", value: "~25 min", tone: "muted" },
        { label: "Rewards (instant)", value: "+250 pts", tone: "good" },
      ],
      total: "$23.38",
      note: "If the DoorDash delivery goes sideways, Ranchie handles it — you never have to contact DoorDash.",
    },
    whichMeans: { metric: "Expectations set + ownership claimed", effect: "fewer confusion contacts; the guest knows who has their back" },
  },
  {
    id: "confirmed",
    stage: "track",
    headline: "The brand keeps its moment",
    narration:
      "The confirmation is a Wingstop moment — a real itemized receipt you can check against the sealed bag, and one place to track. Not a third-party gambling ad sold into the highest-emotion screen of the journey.",
    fixes:
      "The real confirmation was overlaid with a BetMGM $1,500 gambling ad (via Rokt), and there was no receipt — so there was no way to verify the sealed bag against the order.",
    appBar: "Order confirmed",
    bubbles: [{ from: "ranchie", text: "Locked in for store #0145 — Lemon Pepper's already on the fryer. I'll track it right here." }],
    card: {
      kind: "confirm",
      orderNo: "WS-7741",
      eta: "Arriving by 5:14 PM",
      items: [
        { name: "20 PC Boneless — Lemon Pepper", qty: 1 },
        { name: "Large Fries", qty: 2 },
        { name: "Ranch Dip", qty: 3 },
      ],
    },
    whichMeans: { metric: "Brand-owned confirmation + verifiable receipt", effect: "a loyalty moment instead of an off-brand ad" },
  },
  {
    id: "track",
    stage: "track",
    headline: "Tracking that tells the truth",
    narration:
      "One Wingstop-owned tracking surface, with DoorDash's data normalized behind it — and it shows you the real ETA, not whatever the DoorDash webview last managed to load. No dead-end, no CAPTCHA.",
    fixes:
      "The real embedded DoorDash tracker spun, then demanded a Cloudflare 'verify you are human' CAPTCHA — for the entire delivery, including after it had arrived.",
    appBar: "Track your order",
    bubbles: [],
    card: { kind: "tracker", step: 4, eta: "Arriving 5:14 PM", sub: "Driver 0.4 mi out · on time" },
    whichMeans: { metric: "Self-serve visibility you can trust", effect: "deflects 'where's my order?' calls" },
  },
  {
    id: "preempt",
    stage: "track",
    headline: "Owned before you notice",
    narration:
      "This is the loop running forward — and the whole strategic point. The store ran out of bottled water; the operation already knew. Instead of a DoorDash driver telling you to ask for a refund, Wingstop makes it right before you open the bag. Wingstop owns the outcome, not the courier.",
    fixes:
      "In the real session the DoorDash driver did the recovery — he arrived knowing it was wrong and told the guest to ask for a refund. Wingstop never owned it, and there was no in-app path anyway.",
    precondition:
      "Straight up: this depends on a real-time 86/out-of-stock signal from store POS reaching the app before delivery. That integration — plus a reactive fallback when the signal isn't there — is what makes 'pre-emptive' real instead of a nice mockup. And the refund matrix decides who funds the make-it-right, so it doesn't hinge on a Brand Partner's mood.",
    appBar: "Lil Ranchie",
    bubbles: [
      {
        from: "ranchie",
        text: "Heads up — your store just ran out of bottled water. I've already refunded the $1.29 and dropped 200 points in for the trouble. Nothing you need to do.",
      },
    ],
    card: {
      kind: "preempt",
      title: "Made it right · automatically",
      lines: [
        { label: "Refunded", value: "$1.29 to Visa ··· 4821" },
        { label: "Goodwill", value: "+200 pts" },
        { label: "Logged", value: "Auto-resolved · positive" },
      ],
    },
    whichMeans: { metric: "A refund call → a logged positive event", effect: "deflection + positive sentiment, and Wingstop keeps the guest — not DoorDash" },
    triggersPreempt: true,
  },
  {
    id: "heard",
    stage: "insight",
    headline: "Delivered, and actually heard — in her language",
    narration:
      "Maya speaks Spanish at home. The survey renders natively in Spanish (not a translation overlay), it's a few taps for real points, and it closes the loop with a fresh, attributable signal for the store.",
    fixes:
      "The real journey ended with a sealed bag, no receipt, an ~18-minute-late delivery the app never acknowledged, and no quick way — in any language — to say how it went.",
    appBar: "¿Cómo estuvo?",
    bubbles: [
      {
        from: "ranchie",
        lang: "es",
        text: "¿Cómo estuvo la comida? 10 segundos y son +50 puntos — van directo a tu tienda (#0145).",
      },
    ],
    card: { kind: "survey", prompt: "Califica tu pedido", reward: "+50 pts · casi para un ranch gratis", lang: "es" },
    whichMeans: { metric: "Closed-loop feedback, natively multilingual", effect: "the insights baseline gets a real, fresh, in-language signal" },
  },
];
