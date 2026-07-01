# Wingstop Guest Experience (GX) — Product Requirements Document

**Program:** Guest Experience Transformation
**Scope:** Global Survey Insights Platform (WS1) + In-App AI Chatbot "Lil Ranchie" (WS2)
**Version:** 0.1 · Draft for refinement
**Status:** Confidential
**Last updated:** June 2026

**Related artifacts**
- GX Design System (v0.2, light) — visual + interaction system, tokens, components
- GX Guest Journey ("Crave to Closed Loop") — end-to-end CX map
- Guest Persona — Maya Alvarez (primary) + secondary guest personas
- Source: Wingstop GX RFP (June 2026)

---

## 1. Executive Summary

Wingstop guest feedback is fragmented across Sprout, Yext, SMG, DoorDash, Uber Eats, and MCI, with no single guest view and reporting that takes weeks. There is no consistent support experience, no AI self-service, and a federated refund model where Brand Partners (BPs) delay or decline refunds, leaving guests with no escalation path.

This PRD specifies the next generation of GX capability as **one closed-loop operating layer, not two disconnected tools**: feedback comes in, resolution goes out, and every interaction feeds the next. It has two surfaces sharing one data spine:

- **WS1 — Global Survey Insights Platform:** a unified, multilingual feedback and analytics platform with role-based dashboards, replacing SMG and Sprout.
- **WS2 — In-App AI Chatbot ("Lil Ranchie"):** a channel-agnostic, support-first guest assistant that resolves issues against an enforced policy matrix and hands off cleanly to humans.

**Strategic thesis:** The differentiator is not the survey tooling (table stakes) but the **closed-loop resolution layer** — the spine that finally makes feedback actionable and fixes the broken refund experience.

---

## 2. Problem Statement

| # | Problem (current state) | Impact |
|---|---|---|
| P1 | Feedback siloed across 6+ systems; no single guest view | Weeks-long manual reporting; no actionable insight |
| P2 | SMG survey is long, has deliverability issues, no POS integration, no 3P reach | Low response quality; erroneous data discredits results |
| P3 | Ops scorecard rewards Speed over Quality/Accuracy; NPS & Ease of Ordering untracked | Misaligned incentives; hospitality (HYPE) not measured |
| P4 | Inconsistent support — 1P calls store (no ticket); 3P bounced to DSP | No unified workflow, tracking, or SLA |
| P5 | Federated refunds depend on BPs who delay/decline | Guests left with no escalation; churn + bad reviews |
| P6 | No AI self-service while competitors ship chatbots | Avoidable call-center volume; lagging CX |

---

## 3. Goals & Non-Goals

### 3.1 Goals
- G1 — One source of truth for global guest feedback with a refined survey question set.
- G2 — Multilingual surveys with accurate native-language sentiment.
- G3 — An AI chatbot for in-app guest support, resolution, and (future) ordering.
- G4 — Role-based dashboards for BPs, GMs, GX/Social Care, and Call Center.
- G5 — Reduce call-center volume via AI-enabled self-service.
- G6 — Consistent, policy-based refund & resolution workflows between Wingstop and BPs.
- G7 — Sustainable global rollout with structured change management.

### 3.2 Non-Goals (this phase)
- N1 — In-app conversational *ordering* (future-state; specified but not built in v1).
- N2 — Replacing the loyalty/CRM platform (Salesforce) — integrate, not replace.
- N3 — Replacing POS/KDS — integrate only.
- N4 — Net-new social *publishing* tooling beyond listening + social care response.

---

## 4. Success Metrics

### 4.1 North-star
**Closed-loop resolution rate** — % of guest issues captured, resolved, and reflected back into the insights platform with a logged outcome.

### 4.2 Supporting KPIs (the measured CX set)
`Ease of Ordering` · `Speed` · `Accuracy` · `Quality` · `Hospitality (HYPE)` · `NPS` · `CSAT / OSAT` · `CES`

### 4.3 Program KPIs
| Metric | Baseline | Target (post-launch) |
|---|---|---|
| MCI inbound call volume | TBD | Reduce via deflection (target set in pilot) |
| Chatbot deflection rate | 0% | Establish + grow |
| CSAT post-resolution | TBD | ▲ vs. current support |
| Survey response rate | SMG baseline | ▲ via short + incentivized survey |
| Time-to-insight | Weeks | Real-time |
| Refund resolution time | TBD | Reduce; remove BP-decline dead ends |

> Deflection is always measured **alongside** CSAT — never deflection alone (see Guardrail GP4).

---

## 5. Users & Personas

### 5.1 Guests (WS2 + survey)
- **Primary:** Maya Alvarez — Gold Rewards, time-pressed group orderer, mobile-first, EN/ES. (See persona doc.)
- **Secondary:** DSP-only guest, in-restaurant/kiosk guest, lapsed/non-member guest.

### 5.2 Operational roles (WS1 dashboards)
- **Brand Partner Leadership** — portfolio visibility across owned stores.
- **General Managers (GM)** — single-store operational action.
- **GX & Social Care team** — global cockpit; social listening + response.
- **Call Center (MCI) agents** — unified intake, resolution, refunds.

---

## 6. Scope Overview & Phasing

| Phase | Scope | Notes |
|---|---|---|
| **Phase 1 — US Pilot** | WS1 survey + dashboards (GX & Call Center hero), WS2 Lil Ranchie in-app (support + resolution), refund matrix, closed loop | Defined go/no-go before expansion |
| **Phase 2 — US Scale** | BP & GM dashboards, web + SMS/WhatsApp chatbot channels, full social listening | Hypercare 30/60/90 |
| **Phase 3 — International** | Multilingual expansion (AR, Malay/Bahasa, FR), data residency, Arguilea QSC | Native-language + RTL |
| **Future** | In-app conversational ordering via Lil Ranchie | Non-goal for v1 |

---

## 7. Workstream 1 — Global Survey Insights Platform

### 7.1 Survey capabilities
| ID | Requirement |
|---|---|
| SVY-01 | Dynamic survey logic (branching, skip, adaptive question sets) |
| SVY-02 | Mobile-optimized rendering as default |
| SVY-03 | Dynamic QR code entry, integrated with POS (receipts, bag stickers, in-restaurant) |
| SVY-04 | Delivery via email, SMS, and WhatsApp |
| SVY-05 | IP-based deduplication to prevent gamification |
| SVY-06 | Loyalty-points incentive on survey completion (read/write to loyalty) |
| SVY-07 | Refined, shortened question set (replace long SMG survey) |
| SVY-08 | Reaches 1P **and** 3P guests, and in-restaurant guests |

### 7.2 Multilingual & sentiment
| ID | Requirement |
|---|---|
| ML-01 | International language support with text analysis in native language |
| ML-02 | Native-language survey rendering (not translation overlays) |
| ML-03 | Accurate sentiment analysis in **all** supported languages (not translate-to-English) |
| ML-04 | Automatic language detection from guest profile or browser |
| ML-05 | Phase-1 languages: EN, ES, FR; Phase-3: AR (RTL), Malay/Bahasa + TBD |

### 7.3 Data ingestion & integrations
| ID | Source |
|---|---|
| ING-01 | DoorDash ratings & reviews (API) |
| ING-02 | Uber Eats ratings & reviews (API) |
| ING-03 | Google My Business reviews (automated pull) |
| ING-04 | Apple Maps / App Store reviews |
| ING-05 | Social sentiment monitoring: X, Facebook, Instagram, Reddit |
| ING-06 | MCI call-center ticket data |
| ING-07 | AI chatbot session details + feedback (for monitoring & escalation) |

### 7.4 Role-based dashboards
Each role's dashboard is a requirement set; all KPIs are drill-down enabled (global → region → BP → store).

**Brand Partner Leadership (DASH-BP)**
- DASH-BP-01 Portfolio-level NPS, CSAT & sentiment rollup across owned locations
- DASH-BP-02 Social sentiment trends (FB, X, IG, Reddit)
- DASH-BP-03 Google + DSP (DoorDash/UberEats) ratings & review trends
- DASH-BP-04 QSC audit trends by store; flag underperformers
- DASH-BP-05 Survey trends with WoW / MoM / YoY comparisons
- DASH-BP-06 Top issues by category, aggregated across portfolio
- DASH-BP-07 Drill-down from any KPI to store-level detail

**General Managers (DASH-GM)**
- DASH-GM-01 Week-over-week store scorecard (NPS, CSAT, complaint volume)
- DASH-GM-02 Top complaints & compliments, categorized & ranked
- DASH-GM-03 Top operational issues this week (food quality, speed, accuracy)
- DASH-GM-04 Open call-center tickets requiring GM action
- DASH-GM-05 Shift-level performance trends (problem day-parts)
- DASH-GM-06 Social & review alerts needing attention
- DASH-GM-07 Recognition & milestone alerts
- DASH-GM-08 Resolution status of escalated guest issues

**GX & Social Care (DASH-GX)** — *hero dashboard*
- DASH-GX-01 Global / regional / BP / store views with drill-down
- DASH-GX-02 Cross-channel issue trending (social, Google/Apple reviews, DSPs)
- DASH-GX-03 Real-time social listening (respond to FB, X, IG, Google, Apple)
- DASH-GX-04 Social care workflow: assign, escalate, close
- DASH-GX-05 Chatbot metrics: deflection, escalation, post-chat CSAT
- DASH-GX-06 Call-center metrics: volume, SLA adherence, resolution time
- DASH-GX-07 Issue resolution trends (top drivers, category breakdown)
- DASH-GX-08 Industry benchmarking vs. competitors

**Call Center / MCI (DASH-CC)** — *hero dashboard*
- DASH-CC-01 Unified intake queue (surveys, chatbot handoffs, phone calls)
- DASH-CC-02 Full guest context (history, loyalty tier, prior interactions)
- DASH-CC-03 Chatbot handoff transcript & conversation context
- DASH-CC-04 Refund authorization queue with approval workflow
- DASH-CC-05 Resolution method tracking (what was offered & how)
- DASH-CC-06 Closed-loop visibility — GX can see every resolution & response
- DASH-CC-07 Ticket SLA tracking; prioritize by urgency & tier
- DASH-CC-08 Daily/weekly KPI summaries (volume, handle time, CSAT)

### 7.5 Data output & governance
| ID | Requirement |
|---|---|
| OUT-01 | Real-time sync to Snowflake BI data warehouse (or scheduled fallback) |
| OUT-02 | Cleansed, standardized guest record with CRM linkage |
| OUT-03 | Loyalty-ID linkage on all feedback records |
| OUT-04 | Open API / webhook framework for future integrations |
| OUT-05 | Full data dictionary + schema documentation |

---

## 8. Workstream 2 — In-App AI Chatbot ("Lil Ranchie")

### 8.1 Persona & voice
Lil Ranchie is a ranch-bottle character: warm but not goofy, quick and concrete, owns the fix, honest that it's an assistant, and shifts to calm/empathetic when the guest is upset. (Full spec: persona + voice-and-tone matrix in the design system.) The voice-and-tone "Never" column is implemented as **hard runtime guardrails**, not soft prompt suggestions.

### 8.2 Functional requirements
| ID | Capability | Detail |
|---|---|---|
| BOT-01 | Order support | Track orders, report issues, upload photos, select issue type, resolve per matrix |
| BOT-02 | Loyalty & rewards | Check points, redemption, tier status |
| BOT-03 | Account help | Login, password, profile, payment method |
| BOT-04 | Wingstop info | Menu, locations, hours, allergens, promotions |
| BOT-05 | Issue resolution | Refund initiation per policy matrix; credit; points recovery |
| BOT-06 | Live agent handoff | Seamless escalation with full conversation context |
| BOT-07 | Future: ordering | In-app order placement via conversation (Phase: Future) |

### 8.3 Conversation architecture (channel-agnostic)
| ID | Requirement |
|---|---|
| CONV-01 | A channel-neutral conversation service emits **structured message blocks** (type + payload), not free text |
| CONV-02 | Block library: `text` · `quick-replies` · `order-status` · `resolution-options` · `confirmation` · `handoff` · `faq-link` |
| CONV-03 | Every rich block defines a plain-text fallback string |
| CONV-04 | Thin channel adapters render blocks per surface |
| CONV-05 | Channel priority: **In-App (v1)** → Web → SMS/WhatsApp |
| CONV-06 | Guest identity (loyalty ID + recent order) is resolved automatically — never re-requested |

### 8.4 Refund & resolution matrix (policy engine)
The model decides **nothing** about money; it reads the matrix, presents the eligible path, and logs the outcome. Thresholds are illustrative pending Ops/Finance/Legal sign-off; loyalty tier and prior-claim frequency modify limits.

| Issue type | Eligible resolutions | Auto-approve | Else |
|---|---|---|---|
| Missing item (1P) | Refund item · points credit · remake | ≤ $15 | Agent review |
| Order never arrived (3P) | Full refund · account credit | ≤ $25 | Escalate + BP notify |
| Quality (cold / wrong cook) | Partial refund · points credit | ≤ $12 · photo required | Agent review |
| Wrong order | Full refund · remake | ≤ $20 | Agent review |
| Late / long wait | Points credit · discount code | points only | — |

| ID | Requirement |
|---|---|
| REF-01 | Deterministic policy engine returns eligible resolutions + auto-approve decision |
| REF-02 | Resolutions: refund (original payment), account credit, loyalty points, remake/redeliver |
| REF-03 | Every refund logs: policy path, method, amount, BP attribution, approver |
| REF-04 | Engine enforces guardrails so BPs cannot quietly decline an eligible refund |
| REF-05 | Closed-loop record visible to GX & Call Center |

### 8.5 Guardrail principles (testable requirements)
| ID | Principle | Requirement |
|---|---|---|
| GP1 | Policy enforced, never improvised | Money decisions read from the engine; model never invents a refund or policy *(ref: Air Canada liability)* |
| GP2 | Stay in lane | Runtime identity/scope enforcement; off-topic requests redirected, not fulfilled *(ref: Chipotle Pepper scope drift)* |
| GP3 | Human escape hatch, always | One-tap escalation with full context; never a bot-only dead end *(ref: Pepper single-path failure)* |
| GP4 | Augment hospitality | Measured by deflection **and** CSAT; supports HYPE |
| GP5 | Every interaction feeds the loop | Each session logs ticket + sentiment + resolution to WS1 |

### 8.6 Technical & non-functional (WS2)
| ID | Requirement |
|---|---|
| BNF-01 | Native iOS & Android SDK integration with the Wingstop app |
| BNF-02 | Real-time integration with order management & CRM |
| BNF-03 | Loyalty platform integration (read/write points & tier) |
| BNF-04 | Policy engine for automated refund/credit decisioning |
| BNF-05 | Secure PII handling — CCPA, GDPR, PDPA compliant |
| BNF-06 | 99.9% uptime SLA with defined incident response |
| BNF-07 | Multilingual NLU — EN, ES, FR minimum |
| BNF-08 | Chatbot session data exported to WS1 survey insights platform |
| BNF-09 | Human-in-the-loop escalation queue & agent console |
| BNF-10 | Full conversation audit log & analytics dashboard |

---

## 9. The Closed Loop (how WS1 + WS2 connect)

```
Guest issue ──► Lil Ranchie (WS2) ──► Policy engine ──► Resolution (refund/points/remake)
     │                  │                                        │
     │                  └─► Handoff (full context) ─► Call Center (WS1 dashboard)
     ▼                                                           ▼
  Survey / sentiment ──────────────► Cleansed guest record ──► Snowflake
                                                                 │
                              Role dashboards (BP / GM / GX / CC) ◄┘
                                                                 │
                                          Store / BP action ──► Next guest improves
```

| ID | Requirement |
|---|---|
| LOOP-01 | A single cleansed guest record links survey, chatbot, social, and 3P data |
| LOOP-02 | All guest records linkable via loyalty ID and/or email |
| LOOP-03 | Chatbot sessions, resolutions, and sentiment flow to WS1 in real time |
| LOOP-04 | No dead-end interactions — every guest touch produces a logged outcome |

---

## 10. System Architecture & Integrations

Integrations route through Wingstop's **MuleSoft integration layer** and follow best practices.

| System | Disposition | Use |
|---|---|---|
| Snowflake | Keep | BI data warehouse / one source of truth |
| Power BI | Keep | Reporting layer |
| MyWingstop (US only) | Keep | 1P app context |
| DoorDash / Uber Eats / Grubhub | Keep & integrate | DSP orders, ratings, escalation |
| QSC — Steritech (US) / Arguilea (INTL) | Keep & integrate | Audit data |
| POS / KDS (US only) | Keep & integrate | Order data, QR survey trigger |
| CRM / Loyalty — Salesforce | Keep & integrate | Identity, points, tier |
| Zenput / Armadillo, Arize | Integrate | Ops + model monitoring |
| AWS | Keep | Platform / chatbot runtime (AWS or Salesforce) |
| Social: X, FB, IG, TikTok, Reddit | Integrate | Listening + social care |
| MCI Call Center | Reduce | Deflect via self-service; keep for escalation |
| Yext | Reduce | Keep for store listings only |
| SMG (survey) | Retire / replace | Replaced by WS1 |
| Sprout Social | Retire / replace | Replaced by WS1 listening |

| ID | Requirement |
|---|---|
| INT-01 | All integrations broker through MuleSoft where feasible |
| INT-02 | API response < 500ms at P95 for real-time integrations |
| INT-03 | Open API / webhook framework for future connectors |

---

## 11. Data Model (key entities)

- **Guest** — loyalty ID, email, tier, language, consent flags, channel identities (1P/3P).
- **Order** — source (1P/3P), store, items, timestamps, status.
- **Ticket** — issue type, channel, status (New → In progress → Awaiting BP → Auto-resolved → Escalated → Resolved), SLA, owner.
- **Refund** — linked ticket, policy path, method, amount, status (Eligible → Pending → Approved → Issued / Declined), BP attribution, approver.
- **Survey response** — question set, language, sentiment, scores (NPS/CSAT/etc.), loyalty linkage.
- **Chat session** — transcript, blocks, deflection/escalation flag, post-chat CSAT, resolution reference.
- **Sentiment record** — source (survey/social/review/chat), language, polarity, category.

---

## 12. Security, Compliance & Data Governance

| ID | Requirement |
|---|---|
| SEC-01 | SOC 2 Type II certified (required) |
| SEC-02 | GDPR / CCPA / PDPA compliant data handling |
| SEC-03 | Data residency options for EU, UK, SEA markets |
| SEC-04 | Role-based access control with SSO (Okta preferred) |
| SEC-05 | Native language support: EN, ES, FR, AR, Malay/Bahasa + TBD |
| SEC-06 | RTL rendering for Arabic |
| SEC-07 | Localized date/time, currency & number formats per market |
| SEC-08 | 99.9% platform uptime SLA minimum |
| SEC-09 | Defined RTO/RPO for disaster recovery |
| SEC-10 | Scalable to 50M+ annual guest interactions globally |

---

## 13. Design System Reference

The product uses the **GX Design System (v0.2, light)** — theme-aware tokens with a **light default for guest-facing surfaces** (app, web ordering, Lil Ranchie, surveys) and an **optional operator dark mode** for internal tools.

- Brand: Hunter Green `#006341` (PMS 349C), Crave Green `#00B140`, Athletic Gold `#FFB81C` (PMS 124C), Ink `#13180F`, White `#FFFFFF`.
- Type: "Sauce" (display) + Roc Grotesk (UI) — prototype substitutes Archivo Expanded + Inter; swap to licensed faces for production.
- Tokens ship as CSS vars / JSON with documented AA-contrast pairs.
- Components, status models, message blocks, and the two hero dashboard surfaces are defined in the design system.

---

## 14. Rollout & Change Management

| ID | Requirement |
|---|---|
| CM-01 | Stakeholder engagement across GX, Ops, Tech, Legal & Finance with clear RACI + comms cadence |
| CM-02 | Brand Partner enablement: training playbooks, comms, GM-level dashboard adoption training |
| CM-03 | Phased rollout — pilot US first, then international, with defined go/no-go criteria |
| CM-04 | Dedicated PM, weekly status, risk register, milestone tracking (food-service/retail deployment experience required) |
| CM-05 | Refund policy rollout — operationalize updated refund/resolution policies with BPs; platform enforces guardrails |
| CM-06 | Adoption measurement — defined KPIs; post-launch hypercare at 30 / 60 / 90 days |

---

## 15. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Chatbot hallucinates policy → legal liability | Policy engine is deterministic; model never decides money (GP1) |
| Prompt injection / scope drift | Runtime identity + scope enforcement (GP2) |
| Guests trapped in bot-only loops | One-tap human escape hatch with context (GP3) |
| Over-automation erodes hospitality | Measure deflection + CSAT together; support HYPE (GP4) |
| BP non-cooperation on refunds | Engine enforces eligibility; closed-loop visibility (REF-04) |
| Vendor instability in VoC market | Position execution layer over commodity survey engine; open API |
| 3P data gaps | DSP API ingestion + identity linkage (ING-01/02, LOOP-02) |

---

## 16. Open Questions / Decisions Needed

- OQ1 — Chatbot runtime platform: **AWS vs. Salesforce** (RFP lists both).
- OQ2 — Final refund-matrix thresholds (Ops / Finance / Legal sign-off).
- OQ3 — Confirmed Phase-1 deflection and CSAT targets from pilot baseline.
- OQ4 — Survey platform build vs. buy (e.g., Qualtrics named in RFP architecture) and the boundary with our execution layer.
- OQ5 — App default theme for Lil Ranchie (light confirmed; dark optional?).
- OQ6 — Licensed font availability (Sauce / Roc Grotesk) for production.

---

## 17. Acceptance Criteria (representative)

- **AC-WS1** — A guest survey can be triggered by POS QR, rendered natively in ES, completed in < 90s, awards loyalty points, and lands in Snowflake with loyalty linkage and sentiment within the defined sync window.
- **AC-WS2** — A guest reporting a missing item is auto-identified, offered matrix-driven resolutions, refunded within auto-approve limits without BP action, issued a ticket, and offered a one-tap human handoff carrying full context.
- **AC-LOOP** — That same interaction appears in the GX and Call Center dashboards with resolution method and sentiment, and contributes to store-level trend data.
- **AC-DASH** — Each role dashboard renders its required KPI set with global→store drill-down and AA-contrast compliance.

---

## 18. Appendix — Glossary

- **1P / 3P** — first-party (Wingstop app/web) vs. third-party (DoorDash/Uber Eats) guests.
- **BP** — Brand Partner (franchisee).
- **HYPE** — Wingstop's hospitality program; basis for the Hospitality KPI.
- **MCI** — current call-center provider.
- **QSC** — Quality, Service, Cleanliness audits (Steritech US / Arguilea INTL).
- **Closed loop** — feedback → resolution → logged outcome → insight → operational action → improved next experience.

---

*End of PRD v0.1. Next in sequence: a `CLAUDE.md` agent brief for build handoff, and (optional) split PRDs per workstream for parallel engineering.*
