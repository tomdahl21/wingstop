# Wingstop GX — Guest Persona

**Primary persona for the Guest Experience transformation**
Version 0.1 · For refinement · Confidential
Source: GX Guest Journey ("Crave to Closed Loop") + Wingstop GX RFP (June 2026)

---

## Persona at a glance

| | |
|---|---|
| **Name** | Maya Alvarez |
| **Archetype** | The Loyal, Time-Pressed Group Orderer |
| **Age** | 34 |
| **Location** | Dallas, TX (home store #0145 — Lemmon Ave) |
| **Loyalty status** | Wingstop Rewards · **Gold tier** · ~2 orders/month |
| **Primary channel** | Wingstop app (1P) for delivery & pickup; occasionally DoorDash |
| **Devices** | iPhone first; desktop web rarely |
| **Languages** | English primary, Spanish at home — expects either |
| **Spend pattern** | Higher-ticket group orders (game nights, family dinners) |
| **Tech comfort** | High — lives in apps, expects self-service, low patience for phone trees |

> *"I don't want an apology. I want the wings I paid for — or my money back — without calling anybody."*

---

## Who she is

Maya is a Gold-tier Wingstop Rewards member who orders for other people as much as for herself — game nights, family dinners, the office. That makes her **high-value and high-stakes**: when an order is wrong, it's wrong in front of an audience, and the frustration is amplified.

She's mobile-native and self-service-first. She'll happily solve her own problem in an app, but she has near-zero tolerance for friction — phone trees, "please allow 3–5 business days for a response," or being bounced between Wingstop and a delivery app. She's not a complainer by nature; she's a **silent churner**. If the recovery is bad, she won't argue — she'll quietly stop ordering and leave a one-star review.

Because she's a rewards member, Wingstop *knows* her — but only if the systems are connected. Today they often aren't.

---

## Goals

**Functional**
- Get the exact order she paid for, fast.
- When something's wrong, fix it herself in under two minutes.
- Keep her rewards points and tier benefits intact.

**Emotional**
- Feel like a recognized regular, not an anonymous ticket.
- Feel *heard* when she gives feedback — and see it matter.

**Relationship**
- Stay loyal as long as Wingstop keeps earning it. She *wants* to keep ordering; she just needs the experience to hold up.

---

## Behaviors & habits

- Reorders favorites; rarely browses the full menu.
- Orders at peak times (Friday/Saturday night, Sunday games) — exactly when errors and waits spike.
- Reads and leaves reviews; influenced by Google/DSP ratings.
- Will engage a chatbot **if it actually resolves things** — and will abandon it instantly if it loops or stalls.
- Mixes channels without thinking about it: app tonight, DoorDash next week, a text reminder is fine too.

---

## Frustrations (mapped to journey + RFP current state)

| Journey stage | What goes wrong today | Why it hurts Maya |
|---|---|---|
| Order | 1P and 3P are separate worlds; as a DSP guest she's invisible to Wingstop | She's a known Gold member treated like a stranger |
| Receive | Scorecard rewards speed over accuracy; hospitality inconsistently measured | Her order is fast but wrong |
| Hiccup | 1P → call the store (no ticket); 3P → bounced to DoorDash | No clear front door, no record, no SLA |
| Get help | No in-app help → call center only | Long wait for a small fix; competitors have chat |
| Resolve | Federated refunds; BPs delay or decline; no escalation | She's left holding the loss with nowhere to go |
| Heard | Long SMG survey, deliverability issues, weeks-late reporting | Feedback feels like it vanishes |

---

## What Maya needs from each surface

### From Lil Ranchie (in-app assistant)
- **Recognize her instantly** — order, loyalty tier, history — no "what's your order number?"
- **Plain-language understanding** — "my wings were missing," not a menu of codes.
- **Real resolution, not deflection** — refund / points / remake, decided then and there.
- **A one-tap human** with full context, any time she wants it.
- **Honesty** — she's fine talking to a bot; she's not fine being tricked into thinking it's a person.

### From the survey
- **Short** — a few taps, not a 15-minute form.
- **In her language** — natively rendered Spanish, not a translation overlay.
- **Worth her time** — loyalty points for completing it.
- **Visibly consequential** — the sense that a low score actually triggers something.

### From resolution / refunds
- **Deterministic & fair** — the same issue gets the same fix every time, with no BP veto.
- **Fast money** — refund initiated on the spot, clear timing.
- **Choice** — refund, points, or remake, because sometimes she'd rather have the food.

---

## Channel preferences

| Channel | Maya's use | Priority for v1 |
|---|---|---|
| **In-app (iOS)** | Primary — where she orders and where she'll seek help | **Lead surface** |
| **Web** | Occasional, desktop | Secondary |
| **SMS / WhatsApp** | Fine for nudges, status, simple resolution | Future, plain-text fallback |
| **Phone (call center)** | Last resort — only when escalated | Escalation only, with context |

---

## Emotional arc (from the journey)

Anticipation at order → mild dip on receipt → **sharp drop at the hiccup (moment of truth)** → recovery the moment Lil Ranchie helps → relief at resolution → **promoter-level satisfaction at being heard**. The entire business case lives in the ~90 seconds after the mistake: a good recovery moves her *above* her starting sentiment; a bad one ends in churn and a public 1★.

---

## What success looks like for Maya

- She fixes the missing-items problem herself in under two minutes, never touching the phone.
- She keeps her points; the refund hits her card with clear timing.
- The short survey she fills out actually shows up where her home store can act on it.
- Her next order from store #0145 is right — because the loop closed.

---

## Design implications (PRD hooks)

1. **Identity is assumed, not requested.** Every guest-facing surface must resolve loyalty ID + recent order automatically. Asking Maya to re-identify is a failure.
2. **Resolution must be policy-enforced.** The refund/credit amount comes from the matrix, never an AI guess (see *Air Canada* anti-pattern). Maya's fix must be consistent and BP-proof.
3. **Human handoff is always one tap, always with context.** Never trap her in a bot-only loop.
4. **Multilingual is native, not bolted on.** Spanish rendering and sentiment must be first-class.
5. **Feedback must be short, incentivized, and visibly consequential.** Tie completion to points; route results to the dashboards that can act.
6. **Channel-agnostic by design.** One conversation brain; in-app leads, web and SMS/WhatsApp degrade gracefully.

---

## Anti-patterns — what loses Maya

- An apology with no action ("we're sorry, please allow 3–5 days…").
- Being bounced between Wingstop and the delivery app.
- A bot that upsells during a complaint.
- A refund that depends on a Brand Partner who declines it.
- A survey so long she abandons it — or one that feels like it goes nowhere.

---

## Secondary guest personas (for full coverage)

| Persona | Who | Key difference from Maya |
|---|---|---|
| **The DSP-Only Guest** | Orders exclusively via DoorDash/Uber Eats | Currently invisible to Wingstop; needs the loop to reach 3P |
| **The In-Restaurant Guest** | Dine-in / kiosk / counter pickup | Entry via in-restaurant QR survey; no app account assumed |
| **The Lapsed / Non-Member** | Infrequent, not in Rewards | Lower identity signal; resolution must work without loyalty linkage; a recovery moment is a re-acquisition opportunity |

> **Operational personas** (Brand Partner Leadership, General Managers, GX & Social Care team, Call Center agents) are documented separately as part of the role-based dashboard spec — they consume the signal Maya's journey generates rather than experiencing the guest flow.

---

## KPIs this persona moves

`Ease of Ordering` · `Speed` · `Accuracy` · `Quality` · `Hospitality (HYPE)` · `NPS` · `CSAT (post-resolution)` · `Call deflection rate` · `Survey response rate` · `Time-to-resolution`

---

*Next in sequence: this persona feeds the PRD's user-context section and the Lil Ranchie system-prompt/voice spec.*
