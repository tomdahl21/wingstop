# Design Review R1 — The Dahl 4 crew

A review-and-refine pass on the Wingstop GX "art of the possible" demo, run through the
installed product-design crew (`.claude/agents/` + `.claude/skills/design-bar`). Pipeline:
**product-strategist → design-researcher → design-director** (parallel review) → maker
refinement → **design-director re-gate**.

## What the crew found (headline)

- **Strategist:** right mechanism, wrong headline. The demo led with a generic CX truth
  ("better experience → better baseline"). The Wingstop-specific wound the research proves
  is **attribution collapse under DSP dependence** — the DoorDash driver did Wingstop's
  service recovery; even he said "Wingstop can't really do much." Also: the pre-emptive
  recovery centerpiece assumes a real-time store-ops signal it never confronts, and the
  six-lever simulator's false precision is a liability.
- **Researcher:** ranch is architecturally present (mascot) but **verbally absent** — Ranchie
  never talks like the ranch it is. Consulting/SaaS vocab ("meaningful, intentional
  investments," "insights baseline," "…which means chat"); the 🌿 emoji fights the brand;
  the receipt and value/fullness fixes were labeled but not modeled.
- **Director (taste gate):** nameable lineage confirmed (*editorial sports-brand*), zero
  color/type slop — **but the headline craft failure is that guest and operator surfaces
  share one averaged vibe, when differentiation IS the thesis.** Plus emoji-as-iconography
  in the order tracker (incl. a 🥣 bowl in a wings app), `lang="en"` breaking the multilingual
  claim, and dashboards rendering fabricated KPIs/deltas as if live.

## Decisions — what changed and why

| # | Change | Why (finding) |
|---|---|---|
| 1 | **Operator dark mode** — rebuilt `/dashboard` + `/queue` as a dense, tabular, mono-numeric terminal (`.op` tokens, `components/operator.tsx`), distinct from the light guest surfaces | Director **B1** (headline). The design system §13 sanctions an operator dark mode, so the split traces to a real decision, not a default. Guest = generous/confident; operator = dense/fast/legible. |
| 2 | **Real SVG icon set** (`components/icons.tsx`) replacing the emoji order tracker; ranch-bottle `IconSauced` as a brand nod | Director **B2** — emoji-as-iconography on the highest-emotion surface; kills the 🥣 bowl. |
| 3 | **Loading skeletons + honest KPIs** on the operator surfaces; dropped fabricated WoW deltas; labeled `· baseline` (illustrative) vs `· live` (from the spine) | Director **S3/P3** — no more inventing numbers that look fetched. |
| 4 | **Re-pointed the landing** to the DSP-ownership wound ("DoorDash is doing your recovery. Take it back.") + a dark "seam where you leak guests" section (driver-did-recovery, the 1★ hits your store, you pay to be disintermediated) | Strategist **ST1/ST4** — lead with the Wingstop-specific wound; break the uniform section rhythm (Director S1). |
| 5 | **Confronted the pre-emptive precondition** out loud in the pre-empt scene (real-time 86/out-of-stock POS signal + reactive fallback + who funds the refund) | Strategist **ST2** — turn the load-bearing assumption into a credibility moment instead of assuming it. |
| 6 | **Simulator honesty** — reframed `/insights` as directional weights, not point predictions; added an "illustrative · not measured" badge; new brand headline | Strategist **ST3** — false precision was the most attackable surface. |
| 7 | **Ranch-forward voice** — Ranchie now talks as the ranch ("It's Ranchie — your ranch, on speed-dial"), real flavor combos (Lemon Pepper / Mango Habanero / Garlic Parm), value-by-fullness framing; system prompt updated | Researcher — activate the one asset a competitor can't copy. |
| 8 | **Killed consulting/SaaS vocab** — "…which means Ranchie", "same refund matrix your call center uses", "Ranch is in · here for your order" (was "Assistant · replies instantly") | Researcher / Director S5. |
| 9 | **Modeled the itemized receipt** in the confirmation card; sharpened the DoorDash promise ("you never contact DoorDash") | Researcher — the labeled-but-unbuilt fixes. |
| 10 | **A Spanish-native moment** — the survey scene renders in Spanish with per-element `lang="es"` (Maya speaks Spanish at home); root stays `lang="en"` (correct a11y pattern) | Director **B3** — demonstrate the multilingual claim instead of asserting it. |
| 11 | **A11y semantics** — `role="switch"`/`aria-checked` on investment toggles; `role="tab"`/`aria-selected`/`aria-current="step"` on the scene pager | Director **B3/S4**. |
| 12 | **Re-gate fixes** — removed the `⚠️` emoji from the chat error path; raised operator secondary-text contrast to comfortable AA (`--op-lo` and dim greys); aligned the stale "chat" comment | Director re-gate residuals. |

## Deliberately deferred (named, not silently dropped)

- **Second type register** across the system (Director S2) — the display-caps hammer still
  does most hierarchy work. A real data/secondary voice is a larger system change; deferred.
- **Full "loud Wingstop" signature** (Director P1/P4) — wing mark as a structural graphic,
  gold-rule on the "which means" joints, a flavor/texture treatment on the payoff band.
  It's Wingstop-*correct*, not yet Wingstop-*loud*.
- **Mascot states** (Director P2) — Ranchie idle/resolving states, larger presence, a role in
  empty/loading. High-value next step.
- **Strategy content** the strategist flagged as real but out of demo scope — the operational
  reality of the POS signal and BP refund economics are now *named* in the UI, not solved.

## Re-gate verdict

**CLEARED to advance.** All three first-pass blocks (B1/B2/B3) genuinely resolved, no
regressions, clean build (12/12 routes). Residual pushes recorded above.

## Status

Clean `pnpm build`. Runs on `pnpm exec next dev --port 3737`. `/ranchie` chat needs
`ANTHROPIC_API_KEY`; everything else runs key-free. Baseline figures are illustrative.
