# Working Habits

Persistent habits for maintaining project memory across sessions.

---

## Quick Start

**Sync up:** Say "sync up" or "catch me up" to restore context at session start.

---

## Three Habits

### 1. Decision Logging

Log decisions to `docs/DECISIONS.md` when these phrases appear:
- "decided" / "let's go with" / "rejected"
- "choosing X because" / "not doing X because"
- "actually, let's" / "changed my mind"

Before proposing anything, check if it contradicts a past decision. If conflict found:
> This would contradict Decision #N (summary). Override?

**Format:**
```
## Decision #[N] - [Date]
**Context:** [What we were working on]
**Decision:** [What was decided]
**Rationale:** [Why - this is the important part]
**Alternatives considered:** [If any were discussed]
```

### 2. Scope Drift Detection

**This is an active interrupt, not a passive log.**

When the conversation drifts from the stated task:
1. Stop and say: "This is drifting from [original task]. Add to backlog and refocus, or pivot?"
2. If backlog: log to `docs/BACKLOG.md` and return to the original task
3. If pivot: continue, but note the scope change

**Triggers to watch for:**
- "Would it be useful to add X?" (when X wasn't part of original request)
- "We could also do Y" (when Y is unrelated to core ask)
- "While we're at it, let's add Z"
- Any work that extends beyond what was asked

**Do NOT flag** clarifying questions about the core feature or technical approaches to achieve the original goal.

**Backlog format:**
```
### [Date] - [Short title]
**Source:** Identified while working on [context]
**Description:** [What needs to be done]
**Priority:** Low/Medium/High
```

### 3. Git Discipline

**Branching:**
- Brainstorm and plan on main
- When dev starts, create feature branch from main before any file edits
- Branch naming: `feature/[plan-name]`

**Before merging:** Update ALL docs before squash merging to main.
- `docs/DESIGN-SYSTEM.md` -- add/update tokens, components, hooks, or patterns
- `docs/ARCHITECTURE.md` -- add/update patterns for any new architectural decisions, new files, or changed structure
- `CLAUDE.md` -- update the Current Features list if user-facing behavior changed
- `docs/DECISIONS.md` -- log any key decisions made during the feature
- `docs/BACKLOG.md` -- move completed items to Completed section, add any deferred ideas

**Checklist before merge:**
1. DESIGN-SYSTEM.md updated with new tokens/components?
2. ARCHITECTURE.md updated?
3. CLAUDE.md features updated?
4. DECISIONS.md has implementation decisions?
5. BACKLOG.md item moved to Completed?

**During development:** Track intent, not metrics.

- **Scope drift:** "This started as [X] but now includes [Y]. Commit [X] first?"
- **Feature complete:** When user says "done" or "that's it" -> squash merge to main
- **Pre-break:** When user says "break", "later", "tomorrow" -> "Push before you go?"

**Completion:** Squash merge keeps main history clean (one commit per feature).

Never interrupt based on file count or commit count.

---

## Context Recovery

On "sync up" or "catch me up":

1. Read `docs/DECISIONS.md`, `docs/BACKLOG.md`, `docs/ARCHITECTURE.md`
2. Check git status (branch, uncommitted changes, unpushed commits)
3. Check recent git log for context
4. Summarize:
   - Last decision logged
   - Open backlog items
   - Any blockers
   - Git status
5. State readiness

---

## Docs

| File | Purpose |
|------|---------|
| `docs/DECISIONS.md` | Decision log with rationale |
| `docs/BACKLOG.md` | Parking lot for scope creep and deferred ideas |
| `docs/ARCHITECTURE.md` | Technical patterns, component structure, and recipes |
| `docs/plans/` | Design and implementation plans (read-only reference) |

---

## Skill Integration

Skills (superpowers) are tools, not separate processes. Use them naturally:

- **Brainstorming:** Use for non-trivial design work. Flag scope creep during brainstorming.
- **Planning:** Use `writing-plans` or `EnterPlanMode` for multi-file changes, new features, unclear requirements.
- **Implementation:** Use `subagent-driven-development` or `executing-plans` for complex implementations.
- **Debugging state/sync bugs:** Before writing any fix, trace the full data flow (write -> store -> fetch -> parse -> render). Identify all integration points that need coordinated changes. Don't patch one step without understanding the chain.
- **Post-implementation:** Run build/lint verification, handle git workflow, update ARCHITECTURE.md and DECISIONS.md if new patterns or decisions emerged.

### Session Workflow

Brainstorming, planning, and implementation happen across separate sessions:

1. **Brainstorm + Plan (current session):** Explore design, write the plan to `docs/plans/`. This session ends after the plan is written.
2. **Implement (new session):** Start a fresh session, say "sync up", then execute the plan using `executing-plans`, `subagent-driven-development`, or `dispatching-parallel-agents` (for larger plans with independent tasks). The plan file on disk is the handoff artifact — no brainstorm context carries over.

Why: brainstorm sessions accumulate rejected ideas, design exploration, and back-and-forth that wastes context window during implementation. A clean session starts with only what matters: the plan + project docs.

### Plans Must Include Doc Updates

Every implementation plan must include a final step with this exact checklist. This is not optional — it's part of the definition of done, not a merge-time afterthought.

The final plan task should be:

```
### Task N: Update docs

- [ ] DESIGN-SYSTEM.md — new tokens, components, hooks, or patterns
- [ ] ARCHITECTURE.md — new patterns, new files, or changed structure
- [ ] DECISIONS.md — design decisions made during this feature
- [ ] BACKLOG.md — completed items moved, deferred ideas added
- [ ] CLAUDE.md — Current Features list if user-facing behavior changed
```

Copy this checklist verbatim into every plan. Do not paraphrase or summarize — the explicit checklist prevents items from being forgotten.

---

## Project: Aleph Cloud Design System

Tokens-only design system for Aleph Cloud, with a Next.js preview app to visualize brand colors, semantic tokens, typography, gradients, shadows, and transitions.

### Tech Stack

- **Monorepo:** pnpm workspaces (`packages/ds` + `apps/preview`)
- **Framework:** Next.js 16 (App Router, static export)
- **Language:** TypeScript 5.9 (strict)
- **Styling:** Tailwind CSS 4 + CSS custom properties
- **Testing:** Vitest + Testing Library
- **Deployment:** Static export (`out/` directory)

### Commands

```bash
pnpm dev          # Dev server (Turbopack) — preview app
pnpm build        # Static export — preview app
pnpm test         # vitest — DS package
pnpm lint         # oxlint — all workspaces
pnpm typecheck    # tsc --noEmit — all workspaces
pnpm check        # lint + typecheck + test — all workspaces
pnpm --filter @aleph-front-bkp/ds build          # tsup build — DS package only
pnpm --filter @aleph-front-bkp/ds check:package  # publint + attw verification

# Release (see docs/guides/npm-publish.md for full guide)
cd packages/ds && npm version patch  # bump version
git add package.json && git commit -m "release: vX.Y.Z"
git tag vX.Y.Z
git push origin main && git push origin vX.Y.Z  # triggers publish workflow
```

### Key Directories

```
packages/ds/src/styles/       # Design tokens (tokens.css with OKLCH scales)
packages/ds/src/components/   # DS components (button, input, textarea, form-field)
packages/ds/src/lib/          # Utilities (cn.ts)
apps/preview/src/app/         # Next.js pages and layout
apps/preview/src/components/  # Preview-only UI (sidebar, theme-switcher)
docs/plans/                   # Design and implementation plans
```

### Current Features

- pnpm monorepo with source-level subpath exports (`@aleph-front-bkp/ds/*`)
- Three-layer token system (OKLCH color scales 50–950, semantic tokens incl. `--surface` for elevated backgrounds, Tailwind mapping)
- OKLCH color scales for primary, accent, success, warning, error, neutral
- Light/dark theme switching via `.theme-dark` class with `@custom-variant dark`
- Button component with 6 variants, 4 sizes, CVA architecture (primary/secondary use gradient fills, outline uses gradient border)
- Spinner component for loading states
- cn() utility (clsx + tailwind-merge)
- Input component with 2 sizes, shadow-brand (borderless), error/disabled states
- Textarea component with rows default, shadow-brand (borderless), vertical resize, error/disabled states
- Checkbox component (Radix UI) with 3 sizes (xs/sm/md), error/disabled states, clip-path reveal animation
- RadioGroup component (Radix UI) with 3 sizes (xs/sm/md), group/item-level disabled, clip-path reveal animation
- Switch component (Radix UI) with 3 sizes (xs/sm/md), animated sliding thumb, disabled state
- Select component (Radix UI) with flat options prop, 2 sizes, shadow-brand (borderless), error/disabled, portal dropdown
- FormField wrapper with label, required asterisk, helper text, error message, auto-wired accessibility, auto-injects error/aria-invalid into child
- Badge component with 5 semantic variants (default/success/warning/error/info), 2 sizes, rounded corners
- StatusDot component with 5 health status variants (healthy/degraded/error/offline/unknown), pulse animation on healthy, 2 sizes, built-in role="status" and auto aria-label
- Card component with 3 variants (default/noise/ghost), 3 padding sizes, optional title prop
- Skeleton loading placeholder with consumer-driven sizing via className
- Table component with generic typing, sortable columns, keyboard-accessible sorting (Enter/Space), aria-sort, alternating rows, hover, row click (keyboard Enter), activeKey row highlight (aria-current), emptyState prop
- Tooltip component wrapping Radix UI with DS styling, dark mode contrast fix (composable API: Provider, Root, Trigger, Content)
- All animated components respect prefers-reduced-motion via motion-reduce: variants
- Preview app with responsive sidebar navigation (desktop fixed + mobile drawer) and route-per-page (20 pages)
- Static export for deployment
- tsup build pipeline with hybrid publishConfig exports (raw .tsx locally, compiled dist/ on npm)
- GitHub Actions CI (lint, typecheck, test, build, package verify on PRs)
- GitHub Actions publish (tokenless OIDC trusted publishing on v* tag push, npm >= 11.5.1, provenance attestation)
- publint + @arethetypeswrong/cli package verification
