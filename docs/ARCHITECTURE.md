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
│       │   │   ├── badge/
│       │   │   │   ├── badge.tsx
│       │   │   │   └── badge.test.tsx
│       │   │   ├── button/
│       │   │   │   ├── button.tsx
│       │   │   │   └── button.test.tsx
│       │   │   ├── card/
│       │   │   │   ├── card.tsx
│       │   │   │   └── card.test.tsx
│       │   │   ├── checkbox/
│       │   │   │   ├── checkbox.tsx
│       │   │   │   └── checkbox.test.tsx
│       │   │   ├── input/
│       │   │   │   ├── input.tsx
│       │   │   │   └── input.test.tsx
│       │   │   ├── radio-group/
│       │   │   │   ├── radio-group.tsx
│       │   │   │   └── radio-group.test.tsx
│       │   │   ├── select/
│       │   │   │   ├── select.tsx
│       │   │   │   └── select.test.tsx
│       │   │   ├── switch/
│       │   │   │   ├── switch.tsx
│       │   │   │   └── switch.test.tsx
│       │   │   ├── textarea/
│       │   │   │   ├── textarea.tsx
│       │   │   │   └── textarea.test.tsx
│       │   │   ├── form-field/
│       │   │   │   ├── form-field.tsx
│       │   │   │   └── form-field.test.tsx
│       │   │   ├── table/
│       │   │   │   ├── table.tsx
│       │   │   │   └── table.test.tsx
│       │   │   ├── status-dot/
│       │   │   │   ├── status-dot.tsx
│       │   │   │   └── status-dot.test.tsx
│       │   │   ├── tooltip/
│       │   │   │   ├── tooltip.tsx
│       │   │   │   └── tooltip.test.tsx
│       │   │   └── ui/
│       │   │       ├── skeleton.tsx
│       │   │       ├── skeleton.test.tsx
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
│       │   │       ├── badge/page.tsx
│       │   │       ├── button/page.tsx
│       │   │       ├── card/page.tsx
│       │   │       ├── checkbox/page.tsx
│       │   │       ├── input/page.tsx
│       │   │       ├── radio-group/page.tsx
│       │   │       ├── select/page.tsx
│       │   │       ├── switch/page.tsx
│       │   │       ├── textarea/page.tsx
│       │   │       ├── form-field/page.tsx
│       │   │       ├── skeleton/page.tsx
│       │   │       ├── table/page.tsx
│       │   │       ├── status-dot/page.tsx
│       │   │       └── tooltip/page.tsx
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

### Promote Layer 1 Values to Layer 2 When Theme-Dependent

Layer 1 (`@theme`) holds raw brand values that are the same in all themes. If a brand value needs to change between light and dark mode, it must be promoted to a semantic token in Layer 2.

**Pre-flight check before using any brand token in a component:**
1. Will this value look correct on *both* light and dark backgrounds?
2. Does the value contain colors that match or blend into a theme's background?

If either answer is "no," promote the token:
1. Keep the raw value(s) in `@theme` with descriptive suffixes (`-base`, `-dark`)
2. Create a semantic alias in `:root` → `var(--<name>-base)`
3. Override in `.theme-dark` → `var(--<name>-dark)`
4. Consumers reference the semantic name (no suffix)

**Example:** `--gradient-main` has a dark end (`#141421`) that matches the dark mode background. Promoted: `--gradient-main-base` and `--gradient-main-dark` in Layer 1, `--gradient-main` in Layer 2 swaps per theme.

### Ecosystem Aliases for Color Tokens

When a widely-used convention (shadcn, Bootstrap) uses a different name for a color the DS already provides, add a `var()` alias in Layer 1 rather than renaming. The canonical name stays authoritative; the alias prevents silent CSS failures in consumer projects.

**Pattern:** `--color-<alias>-<stop>: var(--color-<canonical>-<stop>)` for each stop in the scale. Also alias gradients if one exists.

**Current aliases:**
| Alias | Canonical | Source convention |
|-------|-----------|-------------------|
| `destructive` | `error` | shadcn/Tailwind |

**When NOT to alias:** Don't alias names that differ in meaning, only in vocabulary. `danger` (Bootstrap) and `destructive` (shadcn) both mean "error-colored" — alias is appropriate. But `info` and `primary` use different colors — that's not an alias, it's a new scale.

---

## Patterns

### Three-Layer Token Architecture

**Context:** Need design tokens that work with Tailwind utilities AND support theming.

**Approach:** Layer 1 (`@theme`) defines raw brand values. Layer 2 (`:root`/`.theme-dark`) defines semantic tokens as CSS custom properties. Layer 3 (`@theme inline`) maps semantic tokens to Tailwind's color system.

**Key files:** `packages/ds/src/styles/tokens.css`

**Notes:** `@theme inline` tells Tailwind to resolve at runtime (not compile time), enabling theme switching. Any Layer 1 value that needs to change per theme (e.g., `--gradient-main`) must be promoted to Layer 2 — see the "Promote Layer 1 Values to Layer 2" rule above.

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

**Examples:**

`border-gradient-main` — gradient borders via `background-clip` trick:
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

`gradient-fill-main` / `gradient-fill-lime` — gradient fills with overlay-based hover states:
```css
.gradient-fill-main { background: var(--gradient-main) border-box; }
.gradient-fill-main:hover {
  background:
    linear-gradient(oklch(1 0 0 / 0.1), oklch(1 0 0 / 0.1)) border-box,
    var(--gradient-main) border-box;
}
```

The overlay technique layers a semi-transparent `linear-gradient(solid, solid)` over the base gradient. This avoids maintaining separate hover gradient definitions — just tune the overlay opacity. Each layer uses inline `border-box` to set both `background-origin` and `background-clip` — this prevents sub-pixel artifacts at rounded corners with `border-transparent` (using a separate `background-origin` longhand after the shorthand causes clipping issues with multi-layer backgrounds).

```tsx
/* Component just applies the class — interactive states are built in */
"gradient-fill-main text-white border-transparent",
```

### Responsive Sidebar Layout (SidebarShell)

**Context:** Preview app needs a sidebar that stays in place while only the main content scrolls, and works on mobile devices.

**Approach:** `SidebarShell` is a client component that owns the mobile drawer state and renders both layouts:
- **Desktop (`lg+`):** Fixed sidebar (`hidden lg:block w-75`) with independent scroll. The outer layout wrapper uses `h-screen flex-col` to lock to viewport height. Below the header, a `flex flex-1 overflow-hidden` container holds sidebar and main.
- **Mobile (`<lg`):** Slide-in drawer (`fixed inset-0 z-40`) with backdrop overlay, `translate-x` transition, and Escape key close. Touch targets bumped to `py-2 px-3` for 44px minimum. A hamburger menu button in a sub-header triggers the drawer.

`SidebarShell` wraps `{children}` (the page content) so the layout component stays a server component — no client-side state leaks into the root layout.

**Key files:** `apps/preview/src/app/layout.tsx`, `apps/preview/src/components/sidebar.tsx`

**Why not `sticky`?** `sticky` positions relative to the scroll container, but the parent flex container grows with content — so there's nothing to stick against. The fixed-height container pattern avoids this entirely.

**Collapsible nav groups:** The sidebar supports `NavGroup` entries (e.g., "Forms") with a chevron toggle. Groups auto-expand when the active route is within their children.

### Motion-Reduce Support

**Context:** Users with vestibular disorders or motion sensitivity need a way to disable animations. `prefers-reduced-motion: reduce` is the OS-level signal.

**Approach:** All animated components use Tailwind's `motion-reduce:` variant to disable motion:
- **Continuous animations** (`animate-pulse`, `animate-spin`): `motion-reduce:animate-none` stops the animation entirely.
- **One-shot transitions** (`transition-[clip-path]`, `transition-transform`): `motion-reduce:transition-none` makes state changes instant.

**Key files:** `skeleton.tsx`, `spinner.tsx`, `status-dot.tsx` (continuous); `checkbox.tsx`, `radio-group.tsx`, `switch.tsx`, `tooltip.tsx`, `table.tsx` (one-shot)

**Rule:** Every new component with animation must include the appropriate `motion-reduce:` variant. Continuous animations use `animate-none`; transitions use `transition-none`.

### Tailwind 4 Dynamic Class Names

**Context:** Tailwind CSS 4's `@theme` tree-shakes CSS custom properties not referenced by detected utility classes. Dynamic class names built via string interpolation (`` `bg-${color}-${stop}` ``) or inline `style={{ backgroundColor: 'var(--color-...)' }}` are invisible to the scanner.

**Approach:** Enumerate all possible class names in a static lookup object. Even though the values are looked up at runtime, the literal strings appear in source code — which is all the scanner needs.

**Key files:** `apps/preview/src/app/foundations/colors/page.tsx` (`SCALE_BG` map)

**Rule:** Never use dynamic Tailwind class construction or inline `var()` styles for `@theme` variables. Always use a static safelist or lookup map.

### Radix UI Wrapper Pattern

**Context:** Form components need rich accessibility (keyboard navigation, ARIA states, focus management) that's expensive to build from scratch.

**Approach:** Wrap Radix UI primitives with `forwardRef`, apply CVA variants via `className`, style Radix `data-[state=*]` attributes with Tailwind classes. Consumers import the DS wrapper — Radix is an internal dependency they never touch directly.

**Key files:** `packages/ds/src/components/checkbox/checkbox.tsx`, `radio-group/radio-group.tsx`, `switch/switch.tsx`, `select/select.tsx`

**Pattern:**
```tsx
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";

const variants = cva(/* base + variants */);

type Props = Omit<ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, "size">
  & VariantProps<typeof variants>
  & { error?: boolean };

const Checkbox = forwardRef<HTMLButtonElement, Props>(
  ({ size, error, className, ...rest }, ref) => (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(variants({ size }), error && "...", className)}
      aria-invalid={error || undefined}
      {...rest}
    >
      <CheckboxPrimitive.Indicator>...</CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  ),
);
```

**Notes:**
- `Omit<..., "size">` removes Radix's native `size` to replace with CVA's typed version
- `data-[state=checked]:` Tailwind modifiers style Radix's state attributes
- `error` prop adds `aria-invalid` for accessibility and error border styling
- Select uses a flat `options` prop wrapping Radix's compound children pattern

### Radix forceMount + Clip-Path Animation

**Context:** Radix UI unmounts Indicator children when unchecked, making CSS transitions impossible. Need smooth reveal animations for check marks and radio dots.

**Approach:** Pass `forceMount` to `<Indicator>` so it stays in the DOM regardless of state. Radix still sets `data-state="checked"|"unchecked"` on force-mounted indicators, enabling pure CSS animation via `clip-path` transitions:

```tsx
<CheckboxPrimitive.Indicator
  forceMount
  className={cn(
    "[clip-path:circle(0%_at_0%_75%)]",
    "data-[state=checked]:[clip-path:circle(100%_at_50%_50%)]",
    "transition-[clip-path] duration-200 ease-in-out",
  )}
>
```

**Key insight:** The `circle()` origin matters — checkbox uses bottom-left (`0% 75%`) to follow the check stroke direction; radio uses center (`50% 50%`) for the symmetrical dot.

**Key files:** `packages/ds/src/components/checkbox/checkbox.tsx`, `packages/ds/src/components/radio-group/radio-group.tsx`

**Notes:** This pattern eliminates any need for JS animation libraries. The `data-state` attribute is the contract between Radix and CSS — no React state or refs needed for the animation itself.

### Test Environment for Radix Components

**Context:** Radix Select uses DOM APIs not available in jsdom (PointerEvent, ResizeObserver, DOMRect, scrollIntoView).

**Approach:** Polyfills are added at the top of `select.test.tsx` before any imports. The `vitest.setup.ts` file imports `@testing-library/jest-dom/vitest` for matchers like `toBeChecked()`, `toHaveAttribute()`, `toHaveClass()`.

**Key files:** `packages/ds/vitest.setup.ts`, `packages/ds/src/components/select/select.test.tsx`

### Generic Typed Table

**Context:** Dashboard pages need data tables with sortable columns, but pulling in TanStack Table or AG Grid for simple use cases adds unnecessary bundle size and API complexity.

**Approach:** A single `Table<T>` component accepts `Column<T>[]` and `T[]` data. Each column defines an `accessor` function for rendering and an optional `sortValue` function for sorting. Sorting is client-side, managed with React state (`useState` for column index and direction). Columns without `sortValue` are not sortable even if `sortable` is set.

**Key files:** `packages/ds/src/components/table/table.tsx`

**Pattern:**
```tsx
export type Column<T> = {
  header: string;
  accessor: (row: T) => ReactNode;   // Cell renderer
  sortable?: boolean;
  sortValue?: (row: T) => string | number;  // Sort comparator
  width?: string;
  align?: "left" | "center" | "right";
};

<Table<Node>
  columns={columns}
  data={nodes}
  keyExtractor={(r) => r.id}
  onRowClick={(row) => setSelected(row)}
/>
```

**Notes:** The generic type parameter flows from `columns` to `data` to `keyExtractor` to `onRowClick` — TypeScript enforces that all four agree on the row type. No `forwardRef` — the outermost element is a `<div>` wrapper for `overflow-x-auto`, not a single semantic element worth ref-forwarding.

### Composable Radix Re-export

**Context:** Tooltip has a naturally composable API (trigger + content can wrap any element) where flattening into a single component would lose flexibility. Different tradeoff from Select, where flat `options` simplified the consumer API.

**Approach:** Re-export Radix primitives directly (`Provider`, `Root`, `Trigger`), only wrapping the `Content` part with DS styling and `forwardRef`. Consumers compose the pieces explicitly.

**Key files:** `packages/ds/src/components/tooltip/tooltip.tsx`

**When to use which pattern:**
- **Flat props wrapper** (Select, Checkbox): When the component has a single primary interaction and compound children add ceremony without flexibility.
- **Composable re-export** (Tooltip): When the trigger can be any arbitrary element and the composition pattern is inherently flexible.

### Minimal forwardRef Wrapper

**Context:** Some components are thin wrappers that apply DS defaults (animation, colors, accessibility attributes) without any variant logic.

**Approach:** `forwardRef` + `cn()` to merge a base class string with consumer `className`. No CVA — there are no variants. Consumer controls sizing entirely via `className`.

**Key files:** `packages/ds/src/components/ui/skeleton.tsx`

**Notes:** Skeleton has no `size` or `variant` prop by design. Width and height are layout concerns that vary per usage context, so the consumer provides them. The DS only controls the visual treatment (pulse animation, muted background, rounded corners).

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

### Adding a Gradient Fill Class

1. Add `.gradient-fill-<name>` in `packages/ds/src/styles/tokens.css` after the existing gradient fill classes
2. Set `background: var(--gradient-<name>) border-box` — inline `border-box` prevents sub-pixel artifacts at rounded corners
3. Add `:hover` with a semi-transparent overlay: `linear-gradient(oklch(... / opacity), oklch(... / opacity)) border-box, var(--gradient-<name>) border-box`. Use white overlay to lighten dark gradients, black overlay to darken light gradients.
4. Add `:active` with a stronger overlay opacity (same `border-box` per layer)
5. In components, apply the class name — hover/active states are built in
6. Document in `docs/DESIGN-SYSTEM.md` § Gradient Fill Utilities

### Adding a New Component

**Build:**
1. Create `packages/ds/src/components/<name>/<name>.tsx` (or `packages/ds/src/components/ui/<name>.tsx` for primitives)
2. Use CVA for variants, `cn()` for class merging, `forwardRef` for DOM access. For interactive controls (checkboxes, selects, etc.), wrap a Radix UI primitive — see "Radix UI Wrapper Pattern" above.
3. Colocate tests as `<name>.test.tsx` — test behavior and accessibility only (see Testing Philosophy above)
4. Export from the component file directly — no barrel `index.ts` files
5. Add subpath export to `packages/ds/package.json`: `"./<name>": "./src/components/<name>/<name>.tsx"`

**Preview:**
6. Create a preview page at `apps/preview/src/app/components/<name>/page.tsx`
7. Add sidebar entry in `apps/preview/src/components/sidebar.tsx` (use a `group` entry for related components like Forms)
8. Run `pnpm dev` and verify the preview page renders correctly — ask the user to check before proceeding

**Verify:**
9. Run `pnpm check` (lint + typecheck + test) — all must pass

**Document (all required — do not skip any):**
10. `docs/DESIGN-SYSTEM.md` § Components — usage examples, props, variants
11. `docs/ARCHITECTURE.md` — add new patterns if this component introduced one (see Patterns section)
12. `docs/DECISIONS.md` — log design decisions (why this API shape, why these variants, alternatives rejected)
13. `docs/BACKLOG.md` — move completed items to archive, add deferred ideas
14. `CLAUDE.md` Current Features list — add component with brief description, update preview page count

**This recipe is the single source of truth.** External projects that add DS components should reference it, not maintain their own copy.
