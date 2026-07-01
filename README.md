# Wingstop Guest Experience (GX) — Art of the Possible

A working "art of the customer-experience possible" demo, grounded in a real Wingstop app
order that went wrong (the TD R1 research session). It makes one causal argument:

> **The customer experience could look like _this_ → which means support could look like
> _that_ → which means your NPS & insights baseline could look like _this_ — if Wingstop
> makes a few meaningful, intentional investments.**

A better front-stage experience isn't a cost; it's the **input** to issue management
(deflection, call volume) and to the insights baseline (NPS, CSAT, sentiment). The demo
shows the whole chain, end to end, and lets you toggle the investments to see what each is
worth.

## The chain (primary surfaces)

- **`/` Overview** — the thesis, the real TD R1 gaps, and the today-vs-baseline payoff.
- **`/order` The experience** — a guided, future-state order journey: Lil Ranchie + ranch
  established _at the order_, working unified tracking, and **pre-emptive recovery** (the
  store ran out of water → Wingstop makes it right before you notice — the loop running
  _forward_). Each scene names the real gap it closes and the downstream "which means →".
- **`/ranchie` Lil Ranchie** — support as the _consequence_ of the relationship. The
  **Claude API** handles voice; a **deterministic policy engine** owns every refund (GP1,
  the Air Canada lesson). Resolutions flow to the dashboards live.
- **`/insights` The baseline** — an **investments → baseline simulator**: toggle the
  intentional investments and watch NPS, deflection, sentiment, and call volume move. Plus
  the live loop (real auto-resolved tickets + sentiment) proving it isn't just a model.

## Operational detail (the back half)

- **`/dashboard` GX Command Center** and **`/queue` Refund Queue** — the operational hero
  dashboards, reading the same in-memory spine. A resolution made anywhere (chat, or the
  pre-emptive recovery on `/order`) appears here within seconds — the closed loop, live.

## Quick start

```bash
pnpm install
cp .env.example .env.local      # then add your ANTHROPIC_API_KEY
pnpm dev                        # http://localhost:3000
```

The **policy engine, dashboards, and refund queue work with no API key.** Only Lil
Ranchie's conversation needs a key (it calls the Claude API). Get one at
[console.anthropic.com](https://console.anthropic.com), or set `ANTHROPIC_AUTH_TOKEN`.

```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-...
# RANCHIE_MODEL=claude-opus-4-8   # optional; claude-sonnet-4-6 for a snappier chat
```

## Walk the chain in 2 minutes

1. **`/order`** — step through the future-state order with Next/Back. Watch the relationship
   start at the order, tracking that works, and at scene 6 hit **"Watch it hit the
   dashboard"** — the **pre-emptive recovery** writes a live, auto-resolved, positive ticket.
2. **`/dashboard`** — it's already there: a would-be refund call logged instead as a positive
   event. The loop ran *forward*.
3. **`/ranchie`** — now support is a continuation, not a cold queue. Try *"My 10pc Lemon
   Pepper was missing"* — **the $8.49 comes from the matrix, not the model.** (Needs a key.)
4. **`/insights`** — toggle the intentional investments and watch the NPS/deflection/sentiment
   baseline move; "Make every investment" lands at NPS **+42** / **61%** deflection.
5. **`/queue`** — approve a pending refund from the policy-enforced authorization card.

## Architecture

```
app/
  page.tsx              Overview — the causal chain, TD R1 gaps, today-vs-baseline payoff
  order/page.tsx        ★ Future-state order experience (scene player + pre-emptive recovery)
  ranchie/page.tsx      Lil Ranchie chat (client): streaming + structured message blocks
  insights/page.tsx     ★ Investments → baseline simulator + live-loop proof
  dashboard/page.tsx    GX Command Center (live, polls the snapshot)
  queue/page.tsx        Call Center Refund Queue + authorization card
  api/
    chat/route.ts       Lil Ranchie conversation service — manual agentic loop over Claude
    preempt/route.ts    Trigger a live pre-emptive recovery (the forward loop)
    snapshot/route.ts   Live read of the data spine (polled by dashboards + insights)
    refunds/route.ts    Agent approve/decline action

lib/
  demo/
    journey.ts          The future-state order scenes (each maps a real gap → "which means")
    baseline.ts         ★ Investments → baseline model (the quantified investment thesis)
  domain/
    types.ts            Core model (PRD §11): Guest, Order, Ticket, Refund, Survey, blocks
    policy.ts           ★ Deterministic refund & resolution matrix (GP1 / REF-01..05)
    store.ts            In-memory data spine + seed + closed-loop + pre-emptive recovery
    blocks.ts           Structured message blocks with plain-text fallbacks (CONV-01..04)
  anthropic/
    ranchie.ts          System prompt, voice/tone guardrails, and tool definitions

components/             TopNav, ChainRail, Phone, UI kit, chat block renderer
context/research/       The TD R1 contextual-inquiry session this demo is grounded in
```

### Grounded in real research (TD R1)

The story isn't invented — it's a real Wingstop app delivery order captured end to end
(`context/research/TD R1/`): an embedded DoorDash tracker that dead-ended in a Cloudflare
"verify you are human" CAPTCHA, a ~18-minute-late delivery the app never acknowledged, a
BetMGM gambling ad injected onto the confirmation screen, and a DoorDash driver who did
Wingstop's service recovery for them. Every future-state scene names the gap it closes.

### The guardrail that matters: the model decides nothing about money

[`lib/domain/policy.ts`](lib/domain/policy.ts) is the single source of truth for every
amount and every auto-approve decision. Lil Ranchie cannot invent a refund because the
amounts live in **tool results, not the prompt** — the model calls `evaluate_resolution`,
reads the engine's verdict, and presents only what it returned. Loyalty tier and
prior-claim frequency modify the limits; the engine enforces them so a Brand Partner can't
quietly decline an eligible refund (REF-04).

The same engine drives the Call Center authorization card — the agent confirms the matrix
decision, never improvises one.

### How Lil Ranchie streams

`api/chat/route.ts` runs a manual agentic loop against the Claude API. The model handles
NLU and voice and calls tools (`lookup_order`, `evaluate_resolution`, `execute_resolution`,
`escalate_to_human`); the route executes them against the policy engine + store and streams
back **both** the model's prose and the structured message blocks the rich surface renders
(newline-delimited JSON). Identity is assumed — Maya is signed in, never re-asked (CONV-06).

## What's mocked vs. real

- **Real:** the Claude API integration (tool use + streaming), the deterministic policy
  engine, the structured message-block system, the closed-loop writes, and the live
  dashboard polling.
- **Mocked:** data persistence (in-memory, reseeds on restart), identity (Maya is the fixed
  signed-in guest), and the integrations behind the loop (Snowflake, MuleSoft, loyalty,
  DSP/social ingestion). Baseline portfolio KPIs are illustrative per the design system.

## Notes

- Stack: Next.js 15 (App Router) · React 19 · TypeScript · Tailwind v4 · `@anthropic-ai/sdk`.
- Design tokens are ported from the GX Design System (v0.2, light) in `app/globals.css`.
  Fonts substitute Archivo Expanded for "Sauce" and Inter for "Roc Grotesk" pending the
  licensed faces.
- Refund-matrix thresholds are illustrative, pending Ops/Finance/Legal sign-off (OQ2).

See [`CLAUDE.md`](CLAUDE.md) for the agent brief / build-handoff notes.
