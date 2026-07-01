---
name: design-bar
description: The design standard every product-design agent on this project is held to. Defines what "good and right for this company" means, names the AI-default patterns that are banned by default, and sets the craft floor. Loaded by the maker (product-designer) and the judge (design-director) so both hold the same line.
---

# The Design Bar

This is the standard. The maker builds to it; the director enforces it. They are the same line, read from two sides.

The goal is not "looks nice." The goal is work that is **unmistakably for this company and this user**, that a senior designer would defend, and that could not have come out of a model averaging every SaaS landing page it has seen. Polish is the floor, not the win.

## The one rule everything else serves

**Every design decision must be traceable to this company, this user, or this constraint — never to a default.** If the only reason a choice is there is "that's what these usually look like," it is wrong by definition. A default is a decision nobody made. We make decisions.

## Name a point of view before building

No project starts until the work commits to a **design lineage** — a named reference the choices descend from. Swiss/editorial. Brutalist-utility. Warm-clinical. Operator-dense terminal. Premium-restraint. Whatever it is, name it, and let it actually constrain type, color, density, and motion. A POV you can name is a POV you can defend. Work with no nameable lineage is the thing we are trying to avoid: the average of everything, the signature of no one.

## Banned by default (the AI tells)

These are the fingerprints of generated design. Each is banned *unless the lineage actively earns it and you can say why in one sentence.*

- **Indigo/violet/purple gradient as the primary accent.** The house color of slop. Derive the palette from the company's actual brand or the domain's real-world materials instead.
- **Inter (or system-ui) as the only typeface, at one or two weights, sized but not styled.** Type is the cheapest way to have a point of view; spend it. Pair with intent, use real weight range, set actual hierarchy.
- **The centered-hero → three-card grid → CTA-band template.** Symmetric, evenly-spaced, every section breathing identically. Vary density. Create tension. Let some things be tight and loud, others quiet.
- **`rounded-2xl` + soft shadow + subtle gradient on every surface.** Effects applied uniformly read as a model reaching for "modern." Pick a corner radius with meaning and hold it; use elevation to mean something.
- **Glassmorphism, floating blurred blobs, gradient text, glow.** Decoration standing in for an idea.
- **Emoji as iconography. "✨ AI-powered." "Seamless." "Elevate." "Empower."** Placeholder voice. Write like the company writes.
- **Lorem ipsum, fake logos in a "Trusted by" bar, smiling-stock-photo energy.** Use real content, real data shapes, real copy. Wrong-but-real beats plausible-but-fake.

The point isn't that these are forbidden forever — it's that each one has to be *chosen and justified*, not defaulted into.

## Calibrate to the user's real context

"Good" is not one thing. Match the work to where it actually lives:

- **Consumer-facing:** generous, confident, opinionated. One signature move done well beats five hedged ones.
- **Operator / internal tools:** dense, fast, legible under pressure. Whitespace that would be elegant on a marketing page is wasted real estate to someone doing this 200 times a day. Optimize for the tenth interaction, not the first.
- **Regulated / high-trust (health, finance, gov):** restraint reads as competence. Earn trust through clarity and craft, not flourish. Get the serious states right.

Density, tone, and motion all move with this. A QSR kiosk, a clinician console, and a wealth dashboard should not share a vibe.

## Craft floor (non-negotiable, every time)

- **Real states:** empty, loading, error, partial, too-much-data, long names that overflow. The happy path is the easy 80%; the bar lives in the other 20%.
- **Accessibility as craft:** visible focus states, real contrast (not just passing — comfortable), keyboard paths, motion that respects reduced-motion. This is part of "good," not a compliance afterthought.
- **Motion with a reason:** every transition earns its place by clarifying a relationship or state change. No motion as garnish.
- **Restraint:** one or two deliberate signature moves, executed precisely. A pile of effects is the absence of taste, not the presence of it.
- **Coded, not mocked:** real components, real layout behavior, real responsiveness — the design proven in the medium it ships in.

## How the director reads this

The critic's job is not to make it nicer. It is to ask, decision by decision: *who made this choice, and what for?* Anything that traces to a default gets named and sent back. Anything that can't survive "why this and not the obvious thing" gets named and sent back. The bar is held by refusing to let the work regress to the mean — quietly is how it always regresses.
