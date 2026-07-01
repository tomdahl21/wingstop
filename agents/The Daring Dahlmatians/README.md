# Product Design Agent Crew

A tight crew of Claude Code agents that build product design to a high bar — work that's specific to the client and the user, with explicit guardrails against averaged, AI-default design. A PM agent points the craft at the right bet before any of it starts.

## What's here

```
.claude/
├── agents/
│   ├── product-strategist.md   # PM: market opportunity → the right bet for this client
│   ├── design-researcher.md    # grounds the work in this company / user / domain
│   ├── product-designer.md     # the maker: coded design system + prototype
│   └── design-director.md      # read-only taste gate: critiques against the bar
└── skills/
    └── design-bar/
        └── SKILL.md            # the shared standard — the keystone
```

The **design-bar skill is the keystone.** It's the one place the standard lives: what "good and right for this company" means, the AI-default patterns banned by default, and the craft floor. The designer and the director both preload it (`skills: [design-bar]`), so the agent that *makes* the work and the agent that *judges* it are held to the same line. Edit the bar in one place and the whole crew moves.

## Install

Drop the `.claude/` folder into a project (project-scoped, version it with the repo so the crew travels with the work), or into `~/.claude/` to make it available across all your projects.

Then in a Claude Code session, run `/agents` to confirm the four agents are loaded. (Manually-added files load at session start; if you edit them on disk, restart the session — or edit via `/agents` to apply immediately.)

## How to run it — the pipeline

The agents auto-delegate by their `description`, but the intended order is a pipeline with a taste gate, not a free-for-all:

1. **product-strategist** — "What's the right bet for this client?" → a product bet brief.
2. **design-researcher** — grounds it in the company / user / domain → a grounding brief + a proposed design lineage.
3. **product-designer** — builds the coded design system + prototype to the bar → working artifacts + a decision note.
4. **design-director** — critiques against the bar → a severity-ranked critique. Loop back to the designer.

You can also invoke any of them explicitly, e.g.:
> Have the design-director review the prototype in /src against the bar.

## Tuning knobs (worth your judgment, not a guess)

- **Design lineage per project.** The single highest-leverage input. The researcher proposes one, but you'll have a sharper instinct for what's right for a McDonald's vs. a United vs. an AbbVie. Set it early.
- **Models.** Judgment-heavy agents (strategist, designer, director) are set to `opus`; researcher to `sonnet`. Subagent-heavy runs use more tokens (each agent keeps its own context), so if cost matters, drop the maker to `sonnet` or set `CLAUDE_CODE_SUBAGENT_MODEL` for a session ceiling.
- **The bar itself.** `design-bar/SKILL.md` is meant to be edited. Add your own banned defaults as you spot them; tighten the calibration rules to your house style.
