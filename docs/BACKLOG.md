# Backlog

Ideas and scope creep captured for later consideration.

---

## How Items Get Here

- Scope drift detected during focused work (active interrupt)
- Ideas that come up but aren't current priority
- "We should also..." moments
- Features identified but deferred

---

## Open Items

### 2026-03-01 — Theme persistence across page reloads

**Source:** Identified during accessibility audit
**Description:** Theme selection resets on page reload. Persist to `localStorage` and apply before first paint (inline `<script>` in `<head>`) to avoid flash of wrong theme.
**Priority:** Medium

### 2026-03-01 — Font loading strategy

**Source:** Identified during accessibility audit
**Description:** External font loading (Typekit, Google Fonts) blocks render and has no fallback strategy. Consider `font-display: swap`, preconnect hints, or self-hosting critical fonts.
**Priority:** Low

### 2026-03-01 — Form control base class deduplication

**Source:** Identified during accessibility audit
**Description:** Input, Textarea, and Select share identical base styles (shadow-brand, focus ring, error border, dark mode bg). Extract shared form control base classes to reduce duplication.
**Priority:** Low

### 2026-02-26 — Logo variants

**Source:** Design doc
**Description:** Add 4 SVG logo variants (icon-only light/dark, icon+wordlogo light/dark).
**Priority:** Medium

### 2026-02-27 — Form components (remaining)

**Source:** Identified while reviewing component coverage
**Description:** Build remaining form components using the token system and CVA architecture. Checkbox, RadioGroup, Switch, and Select are done. Remaining:
- Combobox / Autocomplete — searchable select with filtering
- Slider — range input with min/max/step
- File Upload — drag-and-drop or click-to-upload area
- Number Input / Stepper — numeric input with +/- buttons
**Priority:** Medium

### 2026-02-27 — Component library (remaining)

**Source:** Design doc
**Description:** Build remaining UI components. Badge, StatusDot, Card, Skeleton, Table, Tooltip are done. Remaining:
- Modal / Dialog — overlay with focus trap, close on escape
- Tabs — tab list + panels, keyboard navigation
- Accordion / Collapsible — expand/collapse sections
- Alert / Banner — dismissible status messages
- Avatar — user image with fallback initials
- Pagination — page navigation for lists
- Progress — determinate progress bar
- Breadcrumb — navigation trail
**Priority:** High

### 2026-02-26 — Button icon animations

**Source:** Deferred from button component design
**Description:** Add hover/focus animations to button icons (e.g., arrow slide on hover, plus rotate on focus).
**Priority:** Low

### 2026-02-26 — Package publishing

**Source:** Design doc
**Description:** Publish `@aleph-front/ds` to npm. Monorepo structure is in place — needs tsup build step for compiled dist.
**Priority:** Medium

### 2026-03-01 — FX grain backgrounds (card-noise + variants)

**Source:** Reverse-engineered from Aleph Cloud console (`fx-grain-*` classes)
**Description:** The `card-noise` CSS class and Card `noise` variant are implemented in `tokens.css` and `card.tsx` but not shown in the preview app. Uses SVG `feTurbulence` + `feColorMatrix` alpha thresholding to create scattered purple dots. Dissect the grain effect to create multiple selectable background textures/variants (different frequencies, colors, opacities). Consider extracting the grain as a standalone CSS utility independent of Card.
**Priority:** Medium

---

## Completed / Rejected

<details>
<summary>Archived items</summary>

- [x] 2026-02-26 — Typekit font integration (kit ID: `acb7qvn`)
- [x] 2026-02-26 — Global CLAUDE.md: bundler moduleResolution for Next.js
- [x] 2026-02-26 — Button component (CVA variants, OKLCH color scales, TDD)
- [x] 2026-02-27 — Input, Textarea, FormField components (CVA, accessibility, TDD)
- [x] 2026-02-27 — Monorepo + preview restructure (pnpm workspaces, sidebar + routes)
- [x] 2026-02-27 — Gradient button variants (primary=gradient-main, secondary=gradient-lime, outline=gradient border)
- [x] 2026-02-27 — Form components: Checkbox, RadioGroup, Switch, Select (Radix UI wrappers)
- [x] 2026-02-27 — Select dropdown animation classes are dead (removed, no phantom features)
- [x] 2026-03-01 — Dashboard components: Badge, StatusDot, Card, Skeleton, Table, Tooltip
- [x] 2026-03-01 — Accessibility audit & hardening (StatusDot a11y, FormField error injection, Table keyboard nav, motion-reduce support, responsive mobile layout)
- [x] 2026-03-02 — Align color token naming with Tailwind conventions (`destructive` → `error` alias)

</details>
