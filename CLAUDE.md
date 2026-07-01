# CLAUDE.md — Wingstop GX agent brief

Build-handoff notes for anyone (human or agent) continuing this codebase.

## What this is

An "art of the customer-experience possible" demo built on one causal argument: **a better
front-stage experience dictates better issue management AND a better insights baseline.** The
chain — experience (`/order`) → chat (`/ranchie`) → baseline (`/insights`) — is the product;
the `ChainRail` component keeps it visible. `/dashboard` + `/queue` are the operational back
half. Everything shares one in-memory spine.

It is grounded in real research: the **TD R1** contextual-inquiry session
(`context/research/TD R1/` — see memory `research-td-r1-1p-order` and `gx-demo-direction`). The
reframe from the PRD's reactive loop is **Relationship → Recognition → Resolution**: establish
Lil Ranchie/ranch at the order, have Wingstop own the outcome across 1P/3P, and run the loop
*forward* (pre-emptive recovery) instead of only cleaning up after the hiccup.

Source context lives in [`context/`](context/): the PRD, guest persona (Maya Alvarez), the
guest journey, the GX design system, and the TD R1 research. Read those before changing
product behavior.

## The non-negotiable invariant

**The model decides nothing about money.** Every refund amount and auto-approve decision
comes from [`lib/domain/policy.ts`](lib/domain/policy.ts) (`evaluatePolicy`). Lil Ranchie
learns amounts only through the `evaluate_resolution` tool — they are never in the prompt.
If you add a resolution path, add it to the matrix in `policy.ts`; do not let the model
compute or assert a dollar figure. This is guardrail GP1 (the Air Canada failure mode).

## Where things live

| Concern | File |
| --- | --- |
| Investment thesis → baseline model | `lib/demo/baseline.ts` |
| Future-state order scenes (each → a real gap + "which means") | `lib/demo/journey.ts` |
| Domain model (PRD §11) | `lib/domain/types.ts` |
| Refund/resolution matrix (the wedge) | `lib/domain/policy.ts` |
| Data spine + seed + closed-loop + pre-emptive recovery | `lib/domain/store.ts` |
| Message blocks + plain-text fallbacks | `lib/domain/blocks.ts` |
| System prompt, voice/tone, tool defs | `lib/anthropic/ranchie.ts` |
| Conversation service (agentic loop) | `app/api/chat/route.ts` |
| Live forward-loop trigger (pre-emptive recovery) | `app/api/preempt/route.ts` |
| Live snapshot / refund action APIs | `app/api/snapshot/route.ts`, `app/api/refunds/route.ts` |
| Causal spine UI + reusable phone | `components/ChainRail.tsx`, `components/Phone.tsx` |
| Design tokens | `app/globals.css` (`:root` + `@theme inline`) |

The `baseline.ts` numbers are tuned so "today" = the TD R1 current-state and all-investments =
the design-system targets (NPS +42 / CSAT 88 / 61% deflection / −45% calls / 3× survey). If you
add an investment, give it modeled `effects` that keep that sum intact.

## Conventions

- The store is a process-global singleton (survives hot reload). It reseeds on restart —
  there is no persistence yet. To make it durable, swap the `Map`-backed `GxStore` for a DB
  behind the same read/mutation functions; the surfaces won't change.
- Dashboards are client components that poll `/api/snapshot` (see `components/useSnapshot.ts`).
  That's what makes the closed loop visible in real time.
- Money/structure are deterministic; the model only produces prose + tool calls. Keep that
  boundary: rich blocks are built in `app/api/chat/route.ts` from tool results, not by the model.
- The signed-in guest is fixed to Maya (`SIGNED_IN_LOYALTY_ID` in `lib/anthropic/ranchie.ts`).
  Identity is assumed, never re-requested (CONV-06).

## Model usage

- `@anthropic-ai/sdk`, default model `claude-opus-4-8` (override with `RANCHIE_MODEL`).
- Manual agentic loop with `client.messages.stream(...)` + `.finalMessage()`; tools executed
  server-side; results fed back until `stop_reason !== "tool_use"`.
- Thinking is left off for chat latency; the system prompt keeps responses short and on-voice.

## Commands

```bash
pnpm dev     # local dev
pnpm build   # production build + typecheck (run before committing)
pnpm start   # serve the build
```

Verify the policy engine directly (Node 23+ can run TS):

```bash
node --experimental-strip-types <(echo 'import {evaluatePolicy} from "./lib/domain/policy.ts"; /* ... */')
```

## Not built yet (good next steps)

- Multilingual native rendering + sentiment (ML-01..05) — Maya speaks ES at home.
- Survey surface (WS1 `/survey`) with QR entry + loyalty incentive (the store already has
  `submitSurvey`).
- Real ingestion (DoorDash/Uber/Google/social) behind the sentiment feed.
- Persistence + identity/auth; BP & GM role dashboards (scoped reuse of the GX layout).
- Channel adapters (web widget, SMS/WhatsApp) over the existing block fallbacks.
