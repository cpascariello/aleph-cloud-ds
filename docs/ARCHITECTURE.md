# Architecture

Technical patterns and decisions.

---

## Stack

| Layer | Technology |
|-------|------------|
| Monorepo | pnpm workspaces |
| Framework | Next.js 16 (App Router, static export) |
| Language | TypeScript 5.9 (strict) |
| Styling | Tailwind CSS 4 + CSS custom properties |
| Testing | Vitest + Testing Library |
| Deployment | Static export (`out/` directory) |

---

## Project Structure

```
aleph-cloud-ds/
├── pnpm-workspace.yaml           # Workspace config
├── tsconfig.base.json            # Shared TS compiler options
├── package.json                  # Root scripts (delegates to workspaces)
│
├── packages/
│   └── ds/                       # @aleph-front/ds
│       ├── src/
│       │   ├── components/
│       │   │   ├── button/
│       │   │   │   ├── button.tsx
│       │   │   │   └── button.test.tsx
│       │   │   ├── input/
│       │   │   │   ├── input.tsx
│       │   │   │   └── input.test.tsx
│       │   │   ├── textarea/
│       │   │   │   ├── textarea.tsx
│       │   │   │   └── textarea.test.tsx
│       │   │   ├── form-field/
│       │   │   │   ├── form-field.tsx
│       │   │   │   └── form-field.test.tsx
│       │   │   └── ui/
│       │   │       └── spinner.tsx
│       │   ├── styles/
│       │   │   └── tokens.css
│       │   └── lib/
│       │       └── cn.ts
│       ├── package.json          # Subpath exports, peer deps
│       ├── tsconfig.json
│       └── vitest.config.ts
│
├── apps/
│   └── preview/                  # @aleph-front/preview
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.tsx    # Shell: header + sidebar + content
│       │   │   ├── page.tsx      # Overview landing
│       │   │   ├── globals.css
│       │   │   ├── foundations/
│       │   │   │   ├── colors/page.tsx
│       │   │   │   ├── typography/page.tsx
│       │   │   │   ├── spacing/page.tsx
│       │   │   │   ├── effects/page.tsx
│       │   │   │   └── icons/page.tsx
│       │   │   └── components/
│       │   │       ├── button/page.tsx
│       │   │       ├── input/page.tsx
│       │   │       ├── textarea/page.tsx
│       │   │       └── form-field/page.tsx
│       │   └── components/
│       │       ├── sidebar.tsx
│       │       ├── page-header.tsx
│       │       ├── demo-section.tsx
│       │       └── theme-switcher.tsx
│       ├── package.json
│       ├── tsconfig.json
│       ├── next.config.ts        # transpilePackages + turbopack.root
│       └── postcss.config.mjs
│
└── docs/
    ├── DESIGN-SYSTEM.md
    ├── ARCHITECTURE.md
    ├── DECISIONS.md
    ├── BACKLOG.md
    └── plans/
```

---

## Workspaces

| Workspace | Package name | Purpose |
|-----------|-------------|---------|
| `packages/ds` | `@aleph-front/ds` | Publishable design system (tokens, components, utilities) |
| `apps/preview` | `@aleph-front/preview` | Next.js preview app for visual documentation |

### Source exports (no build step)

The DS package exports raw `.tsx` source files via `"exports"` in `package.json`. Consumers compile it themselves via their bundler. This eliminates a build step entirely. Consumer apps must add `transpilePackages: ["@aleph-front/ds"]` to their Next.js config.

### Deep imports (no barrel files)

Components are imported individually: `@aleph-front/ds/button`, not `@aleph-front/ds`. This is explicit, tree-shakeable, and requires no barrel file maintenance.

---

## Import Aliases

| Alias | Scope | Resolved to | Configured in |
|-------|-------|-------------|---------------|
| `@ac/*` | DS package internal | `packages/ds/src/*` | `packages/ds/tsconfig.json`, `packages/ds/vitest.config.ts` |
| `@preview/*` | Preview app internal | `apps/preview/src/*` | `apps/preview/tsconfig.json` |
| `@ac/*` | Preview app (cross-workspace) | `packages/ds/src/*` | `apps/preview/tsconfig.json` |

The preview app needs `@ac/*` in its tsconfig because TypeScript follows imports inside transpiled DS source files.

**CSS imports are the exception** — PostCSS does not resolve tsconfig aliases, so `@import` paths in `.css` files must be relative (see Decision #5).

---

## Rules

### No Tailwind Prefix Collisions in Token Names

Semantic token names must not duplicate a Tailwind utility prefix. When a token name matches a prefix, the resulting class stutters (e.g., `border-border`). Check against: `bg-`, `text-`, `border-`, `shadow-`, `ring-`, `outline-`.

**Example:** The border color token is named `edge`, not `border`, giving `border-edge` instead of `border-border`.

---

## Patterns

### Three-Layer Token Architecture

**Context:** Need design tokens that work with Tailwind utilities AND support theming.

**Approach:** Layer 1 (`@theme`) defines raw brand values. Layer 2 (`:root`/`.theme-dark`) defines semantic tokens as CSS custom properties. Layer 3 (`@theme inline`) maps semantic tokens to Tailwind's color system.

**Key files:** `packages/ds/src/styles/tokens.css`

**Notes:** `@theme inline` tells Tailwind to resolve at runtime (not compile time), enabling theme switching.

### Theme Switching

**Context:** Support light/dark themes without JS-based CSS-in-JS.

**Approach:** Toggle `.theme-dark` class on `<html>` element. CSS custom properties in `:root` vs `.theme-dark` swap automatically. A `@custom-variant dark` in `globals.css` registers the `dark:` Tailwind variant to match `.theme-dark`, enabling `dark:text-error-300` etc. in components.

**Key files:** `packages/ds/src/styles/tokens.css`, `apps/preview/src/app/globals.css`, `apps/preview/src/components/theme-switcher.tsx`

**Adding more themes:** Use the same `@custom-variant` pattern (e.g., `@custom-variant contrast (&:where(.theme-contrast, .theme-contrast *))`). Add corresponding CSS custom property blocks in `tokens.css`.

### CVA Variant Pattern

**Context:** Need type-safe component variants without CSS-in-JS or manual class string management.

**Approach:** Use Class Variance Authority (`cva`) to define variant maps. Each variant is an object key mapping to Tailwind class strings. `defaultVariants` sets fallbacks. The `cn()` utility (clsx + tailwind-merge) handles conditional classes and Tailwind conflict resolution.

**Key files:** `packages/ds/src/components/button/button.tsx`, `packages/ds/src/lib/cn.ts`

**Adding a new variant:** Add an entry to the `variants` object inside the `cva()` call. The variant key becomes the prop value (e.g., `variant="ghost"` → add `ghost: "..."` to the variant map). TypeScript infers the new prop value automatically.

### Custom CSS Classes for Complex Effects

**Context:** Some CSS effects (gradient borders, complex backgrounds) require multiple properties working together and can't be expressed as plain Tailwind utilities.

**Approach:** Define plain CSS classes in `tokens.css`, colocated with the tokens they consume. Include interactive states (`:hover`, `:active`) directly in the class so components just apply a single class name. Plain CSS avoids Tailwind's `@media (hover: hover)` wrapping, which causes Turbopack CSS parser issues with `var()` in nested hover contexts.

**Key files:** `packages/ds/src/styles/tokens.css` (after the Layer 3 Tailwind bridge block)

**Why not `@utility`?** Tailwind 4's `@utility` wraps `:hover` in `@media (hover: hover)`, and Turbopack's CSS optimizer can't parse `var()` in that nesting. Plain CSS classes avoid this.

**Decision framework — when a style can't be a plain Tailwind class:**

1. **First choice: Tailwind utility or arbitrary value** — if the effect can be a single `[property:value]` in a class string, use it inline.
2. **Second choice: plain CSS class in `tokens.css`** — if the effect requires multiple CSS properties working together (e.g., `background-clip` + `background` + `border-color`), extract to a CSS class with interactive states baked in.
3. **Never: custom classes in `globals.css`** — `globals.css` is for Tailwind imports, content sources, variant registrations, and base element styles only.

**Example:** `border-gradient-main` uses the background-clip trick for gradient borders with rounded corners. Each state has the full `background` declaration referencing color scale tokens.

```css
.border-gradient-main {
  border-color: transparent;
  background:
    linear-gradient(var(--color-primary-100), var(--color-primary-100)) padding-box,
    var(--gradient-main) border-box;
}
.border-gradient-main:hover { /* same with primary-200 */ }
.border-gradient-main:active { /* same with primary-300 */ }
```

```tsx
/* Component just applies the class — interactive states are built in */
"border-gradient-main text-primary-700",
```

### Fixed Sidebar Layout

**Context:** Preview app needs a sidebar that stays in place while only the main content scrolls.

**Approach:** The outer layout wrapper uses `h-screen flex-col` to lock to viewport height. Below the header, a `flex flex-1 overflow-hidden` container holds the sidebar and main. Both panels handle their own `overflow-y-auto`. The sidebar stays put because its container doesn't grow — only `<main>` scrolls.

**Key files:** `apps/preview/src/app/layout.tsx`, `apps/preview/src/components/sidebar.tsx`

**Why not `sticky`?** `sticky` positions relative to the scroll container, but the parent flex container grows with content — so there's nothing to stick against. The fixed-height container pattern avoids this entirely.

### Tailwind 4 Dynamic Class Names

**Context:** Tailwind CSS 4's `@theme` tree-shakes CSS custom properties not referenced by detected utility classes. Dynamic class names built via string interpolation (`` `bg-${color}-${stop}` ``) or inline `style={{ backgroundColor: 'var(--color-...)' }}` are invisible to the scanner.

**Approach:** Enumerate all possible class names in a static lookup object. Even though the values are looked up at runtime, the literal strings appear in source code — which is all the scanner needs.

**Key files:** `apps/preview/src/app/foundations/colors/page.tsx` (`SCALE_BG` map)

**Rule:** Never use dynamic Tailwind class construction or inline `var()` styles for `@theme` variables. Always use a static safelist or lookup map.

### cn() Utility

**Context:** Tailwind classes can conflict (e.g., `bg-red-500` and `bg-blue-500` both present). Need predictable overrides when merging conditional classes.

**Approach:** `cn(...inputs)` composes `clsx` (conditional joining) with `twMerge` (Tailwind-aware deduplication). Always use `cn()` instead of template literals for class composition in components.

**Key files:** `packages/ds/src/lib/cn.ts`

---

## Testing Philosophy

**Test behavior and accessibility, not appearance.**

Design system components are visual by nature — most of their code maps props to CSS classes. Testing those class names creates brittle tests that break on every visual redesign without catching real bugs. The preview app is the right place to verify appearance.

**What to test:**

| Category | Example | Why |
|----------|---------|-----|
| Interactive behavior | Loading state shows spinner, hides icons | Logic that can silently break |
| Accessibility | `aria-busy` when loading, `disabled` attribute | Invisible to visual review |
| Polymorphism | `asChild` renders an `<a>` instead of `<button>` | Non-obvious DOM behavior |
| Prop forwarding | `aria-label`, `className` merging | Contract with consumers |
| Structural layout | Icon renders before/after label | DOM ordering affects UX |

**What NOT to test:**

| Category | Example | Why |
|----------|---------|-----|
| CSS class names | "contains `bg-primary-600`" | Coupled to implementation, breaks on redesign |
| Token values | "primary-500 is this OKLCH value" | Tokens are declarative — preview app is the test |
| Browser APIs | `classList.toggle` works | Testing the platform, not your code |
| Theme switching | Dark class toggles correctly | Too trivial; covered by manual preview |

**Colocate tests** with components as `<name>.test.tsx`. Run with `pnpm test` (vitest).

---

## Recipes

### Adding a New Semantic Token

1. Add light value to `:root` block in `packages/ds/src/styles/tokens.css`
2. Add dark value to `.theme-dark` block
3. Add Tailwind mapping in `@theme inline` block (e.g., `--color-new-token: var(--new-token)`)
4. Use as Tailwind class: `bg-new-token`, `text-new-token`, etc.

### Adding a Gradient Border Class

1. Add `.border-gradient-<name>` in `packages/ds/src/styles/tokens.css` after the existing gradient border classes
2. Set `border-color: transparent` and the full `background` with `padding-box` / `border-box` clip
3. Add `:hover` and `:active` selectors with the appropriate fill color stops
4. In components, apply the class name — no hover overrides needed
5. Document in `docs/DESIGN-SYSTEM.md` § Gradient Border Utilities

### Adding a New Component

1. Create `packages/ds/src/components/<name>/<name>.tsx` (or `packages/ds/src/components/ui/<name>.tsx` for primitives)
2. Use CVA for variants, `cn()` for class merging, `forwardRef` for DOM access
3. Colocate tests as `<name>.test.tsx` — test behavior and accessibility only (see Testing Philosophy above)
4. Export from the component file directly — no barrel `index.ts` files
5. Add subpath export to `packages/ds/package.json`: `"./<name>": "./src/components/<name>/<name>.tsx"`
6. Create a preview page at `apps/preview/src/app/components/<name>/page.tsx`
7. Add sidebar entry in `apps/preview/src/components/sidebar.tsx` (use a `group` entry for related components like Forms)
8. Document usage in `docs/DESIGN-SYSTEM.md` § Components
