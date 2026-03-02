# Decisions Log

Key decisions made during development. When you wonder "why did we do X?", the answer should be here.

---

## How Decisions Are Logged

Decisions are captured when these phrases appear:
- "decided" / "let's go with" / "rejected"
- "choosing X because" / "not doing X because"
- "actually, let's" / "changed my mind"

Each entry includes:
- Context (what we were working on)
- Decision (what was chosen)
- Rationale (why - the most important part)

---

## Decision #44 — 2026-03-02

**Context:** scheduler-dashboard used `var(--color-destructive)` for sparkline colors — a name from the shadcn/Tailwind convention. The DS uses `error` for the same color. The token resolved to nothing, causing invisible sparklines.
**Decision:** Add `destructive` as a pure CSS alias for `error` at Layer 1 (`@theme`). Full scale (`--color-destructive-{50..950}`) and gradient (`--gradient-destructive`) point to their `error` counterparts via `var()`. DS components keep `error` in their prop APIs.
**Rationale:** `error` and `destructive` describe different concepts (state vs intent) but use the same color. Renaming all components to `destructive` would make `<Badge variant="destructive">` and `<StatusDot status="destructive">` read wrong semantically. The alias lives at the color token layer where the naming mismatch actually caused the failure. Adding the alias is zero-cost (CSS `var()` references) and prevents silent failures in any consumer project that reaches for the shadcn convention.
**Alternatives considered:** Renaming `error` → `destructive` everywhere (breaks semantics of non-action components), documenting without aliasing (doesn't prevent the failure), adding `danger` alias too (YAGNI — no real-world hit yet).

## Decision #43 — 2026-03-01

**Context:** Shadow scale had inconsistent geometry — `brand-sm` used 4px blur while `brand` and `brand-lg` shared 24px blur with only opacity difference. Adding `shadow-brand-xs` for subtle form field shadows made the scale naming confusing (xs had bigger blur than sm).
**Decision:** Remove `brand-xs`. Adjust `brand` to 10% opacity (was 15%) for subtler default. Adjust `brand-lg` to 48px blur / 25% opacity (was 24px / 45%) for a proper size progression. Keep `brand-sm` at 4px/15% for tight elements.
**Rationale:** The scale now progresses in both blur radius (4 → 24 → 48) and opacity (15% → 10% → 25%). `sm` is intentionally high-opacity-low-blur for sharp, grounded shadows on small elements. The unprefixed `brand` step follows Tailwind naming convention (base step has no modifier). Form fields use `shadow-brand` at 10% — subtle enough without needing a separate token.

## Decision #42 — 2026-03-01

**Context:** The `--card` / `--card-foreground` semantic tokens were used by 6 components (Card, Input, Textarea, Select, Checkbox, RadioGroup) — functioning as a general "elevated surface" token, not a card-specific one. Light mode value was pure white (`#ffffff`), disconnected from the purple-tinted brand.
**Decision:** Rename `--card` to `--surface`, `--card-foreground` to `--surface-foreground`. Change light mode value from `#ffffff` to `var(--color-primary-50)` (faint purple tint). Dark mode value unchanged (`base-900`).
**Rationale:** Role-based naming (`surface`) is self-documenting when the next component needs the same color. Component-based naming (`card`) requires tribal knowledge that "card actually means any elevated surface." The `primary-50` light value ties surfaces to the brand palette — borders (`border-edge`) provide visual separation from the page background (`#F9F4FF`), which is close in lightness.
**Alternatives considered:** Keeping `--card` (shadcn convention, widely understood but misleading), adding `--surface` as an alias (violates "replace, don't deprecate"), using raw scale color without semantic token (6 components would each need `bg-white dark:bg-base-900`).

## Decision #41 — 2026-03-01

**Context:** TypeScript `exactOptionalPropertyTypes: true` prevents passing `(() => void) | undefined` to an optional prop typed as `onClick?: () => void`. The mobile drawer passes `onLinkClick` (which may be undefined) to NavLink's `onClick` prop.
**Decision:** Use conditional spread pattern: `{...(onLinkClick ? { onClick: onLinkClick } : {})}`. The truthy branch narrows to non-undefined; the empty object skips the prop entirely.
**Rationale:** This is the idiomatic TypeScript pattern for strict optional properties. Changing the prop type to `() => void | undefined` doesn't fix it because the outer union `T | undefined` is the issue, not the function return type. The conditional spread is zero-cost at runtime and fully type-safe.

## Decision #40 — 2026-03-01

**Context:** Preview app sidebar was desktop-only — unusable on mobile. Need responsive navigation without prop-drilling state through server component boundaries.
**Decision:** Create `SidebarShell` client component that owns drawer state and renders both desktop sidebar and mobile drawer. Layout passes `{children}` through it. Mobile gets a hamburger button in a sub-header, a slide-in drawer with backdrop, and Escape key close.
**Rationale:** SidebarShell encapsulates all client-side state (open/close) in one component, keeping the root layout as a server component. The drawer uses CSS transitions (`translate-x` + opacity backdrop) for smooth motion. Touch targets bumped to 44px minimum. Nav links auto-close the drawer on click.
**Alternatives considered:** CSS-only drawer with checkbox hack (no Escape key support, no click-outside), separate mobile nav component in layout (requires lifting state into a client layout wrapper).

## Decision #39 — 2026-03-01

**Context:** Audit found that animated components (Skeleton, Spinner, StatusDot, Checkbox, RadioGroup, Switch, Tooltip) don't respect `prefers-reduced-motion: reduce`.
**Decision:** Add `motion-reduce:animate-none` to continuous animations (pulse, spin) and `motion-reduce:transition-none` to one-shot transitions (clip-path, transform) across all animated components.
**Rationale:** Tailwind's `motion-reduce:` variant maps to `@media (prefers-reduced-motion: reduce)`, which is the standard OS-level signal for motion sensitivity. Two categories: continuous animations should stop entirely; one-shot transitions should become instant. This is a structural rule — every new animated component must include the appropriate variant.

## Decision #38 — 2026-03-01

**Context:** Audit found Table component lacked keyboard accessibility — sortable headers and clickable rows were mouse-only.
**Decision:** Add `tabIndex={0}` to sortable headers and clickable rows. Headers respond to Enter/Space for sort cycling. Rows respond to Enter for click. Add `aria-sort` attribute (`ascending`/`descending`/`none`) to sortable headers. Add `emptyState` prop for empty data.
**Rationale:** Keyboard-only users couldn't sort columns or click rows. `aria-sort` communicates sort state to screen readers. The `emptyState` prop prevents empty tables from rendering nothing — consumers provide context like "No data found" that spans all columns.
**Alternatives considered:** Using `<button>` inside `<th>` (adds nesting complexity, breaks semantic table structure), `role="button"` on `<th>` (non-standard).

## Decision #37 — 2026-03-01

**Context:** When FormField has an `error` message, consumers must manually pass `error={true}` to both FormField and the child input. Easy to forget the child prop.
**Decision:** FormField auto-injects `error={true}` and `aria-invalid={true}` into the child input via `cloneElement` when FormField's `error` prop is present.
**Rationale:** The FormField already knows whether there's an error — duplicating this in the child is redundant and error-prone. `cloneElement` merges props onto the existing child without wrapping it in an extra element. The `aria-invalid` injection ensures screen readers announce the error state even if the child component doesn't handle `error` prop styling.

## Decision #36 — 2026-03-01

**Context:** Audit found StatusDot was invisible to screen readers — a purely visual indicator with no semantic meaning.
**Decision:** Add built-in `role="status"` and auto-derived `aria-label` from the status prop (e.g., `status="healthy"` → `aria-label="Healthy"`). Consumers can override with a custom `aria-label` via spread props.
**Rationale:** Status indicators are meaningless without text equivalents. Auto-deriving the label from the prop avoids forcing every consumer to remember `aria-label`. The `role="status"` creates a live region so screen readers announce changes. Consumer override is still possible because `{...rest}` spreads after the default `aria-label`.
**Alternatives considered:** Requiring consumers to always pass `aria-label` (easy to forget, audit showed this was the common case).

## Decision #35 — 2026-03-01

**Context:** Form fields (Input, Textarea, Select) use `bg-card` which resolves to `base-900` in dark mode — nearly the same lightness as the page background.
**Decision:** Add `dark:bg-base-800` to form field components for a slightly elevated fill in dark mode.
**Rationale:** `base-800` (lightness 0.28) vs `base-900` (lightness 0.22) gives form fields a subtle visual lift without a dramatic contrast shift. Component-level override rather than changing the `--card` semantic token, which would affect all cards.

## Decision #34 — 2026-03-01

**Context:** Badge component used `rounded-full` (pill shape).
**Decision:** Change to `rounded` (4px border radius) for subtler, more rectangular badges.
**Rationale:** Pill badges feel like tags/chips. Squared-off badges with subtle rounding better suit status labels and category markers in dashboard layouts.

## Decision #33 — 2026-03-01

**Context:** Tooltip uses hardcoded `bg-neutral-900` (lightness 0.21). In dark mode, the page background is `#141421` (~lightness 0.15), making the tooltip nearly invisible.
**Decision:** Add `dark:bg-base-700` to tooltip content. The `base-700` token (lightness 0.34) provides visible contrast against the dark background.
**Rationale:** Component-level `dark:` override rather than a semantic token because tooltips intentionally use an inverted color scheme (dark on light, light on dark would be a different design choice). The `base` scale is purpose-built for dark surface elevation.

## Decision #32 — 2026-03-01

**Context:** Form fields (Input, Textarea, Select trigger) used `border-3 border-edge` with `hover:border-edge-hover`. Testing a softer, more branded look.
**Decision:** Replace borders with `shadow-brand` (borderless fields with purple-tinted shadow). Error state still applies `border-3 border-error-400` for clear visual distinction.
**Rationale:** The brand shadow uses the primary purple hue at 15% opacity, tying form fields to the brand identity in a way neutral borders couldn't. Removes the hover border state — the shadow provides enough definition without needing a hover transition. Error state intentionally re-introduces the border because shadows alone don't communicate "error" clearly enough.
**Alternatives considered:** `shadow-brand-sm` (too subtle), `shadow-brand-lg` (too dramatic for resting state), keeping border + adding shadow (redundant visual weight).

## Decision #31 — 2026-03-01

**Context:** Skeleton component needs to show loading placeholders for text lines, input fields, avatars, table rows, etc. — all with different dimensions.
**Decision:** No `size` or `variant` props. Skeleton is a minimal `forwardRef` wrapper that applies pulse animation and muted background. Consumer controls all sizing via `className` (e.g., `className="h-4 w-32"` for a text line, `className="size-12 rounded-full"` for an avatar).
**Rationale:** Width and height are layout-specific — a skeleton for a table cell is different from one for a card title. Baking size variants into the component would either cover too few cases or explode into dozens of presets. `className` is the natural API for layout dimensions in a Tailwind system.
**Alternatives considered:** `width`/`height` props (adds prop API surface without value over className), preset shapes like `variant="circle"` (too limiting, `rounded-full` in className handles it).

## Decision #30 — 2026-03-01

**Context:** Tooltip wraps Radix UI like the form components, but its usage pattern is different — the trigger can be any arbitrary element and the content appears in a portal.
**Decision:** Use a composable re-export pattern: re-export `Provider`, `Root`, `Trigger` directly from Radix, only wrap `Content` with DS styling and `forwardRef`. Consumers compose the four pieces explicitly.
**Rationale:** Tooltip's trigger is inherently flexible — it can wrap a button, icon, truncated text, or any element. A flat-props API (`<Tooltip text="..." trigger={<button/>}`) would force consumers to extract the trigger into a separate variable and lose the natural JSX nesting. The composable pattern matches React's composition model. This is the opposite tradeoff from Select, where flat `options` simplified a naturally complex API.
**Alternatives considered:** Single-component API with `trigger` prop (loses JSX composition), fully custom tooltip without Radix (reinvents portal management, collision detection, keyboard handling).

## Decision #29 — 2026-03-01

**Context:** Dashboard pages need sortable data tables. Could use TanStack Table, AG Grid, or a custom component.
**Decision:** Build a lightweight generic `Table<T>` component with client-side sorting. No external table library. Columns define `accessor` (cell renderer) and `sortValue` (sort comparator) as separate functions.
**Rationale:** The dashboard tables have <100 rows — client-side sorting in React state is trivial and instant. TanStack Table adds ~45KB (min+gzip) and a complex headless API that's overkill for rendering rows with optional sort. Separating `accessor` from `sortValue` lets the cell render rich content (JSX with badges, status dots) while sorting on the underlying primitive value. The generic `<T>` parameter ensures type safety flows from column definitions to data to callbacks without manual annotation.
**Alternatives considered:** TanStack Table (powerful but heavy for simple tables), no sorting (too limiting for dashboard use cases), sort by accessor return value (can't sort on underlying number when cell renders formatted string).

## Decision #28 — 2026-02-27

**Context:** Checkbox, RadioGroup, and Switch components had smaller dimensions (sm=16px, md=20px) than front-core and only 2 size tiers. Indicators had no entry animation. All form fields used `border-2` (2px) borders.
**Decision:** Align with front-core proportions: 3 size tiers (xs=16px, sm=24px, md=28px), 65% indicator proportion, per-size border-radius on checkbox. Add clip-path reveal animations using Radix `forceMount` + CSS `clip-path` transitions. Switch track/thumb sizes scaled proportionally with 2px edge gap. Standardize all form field borders to `border-3` (3px) across Checkbox, RadioGroup, Switch, Input, Textarea, and Select.
**Rationale:** `forceMount` keeps the Indicator in the DOM regardless of checked state, enabling pure CSS animation via `data-state` attribute changes. Clip-path `circle()` transitions create a smooth reveal: bottom-left origin for checkbox (follows check stroke direction), centered for radio (symmetrical dot). No JS animation library needed. Switch already had `transition-transform` on thumb, so only sizing changes were needed. The 3px border gives form fields more visual weight and definition, matching the error state border width that was already 3px.
**Alternatives considered:** CSS `scale` animation (doesn't reveal progressively), JS-driven animation (unnecessary complexity when CSS can drive it via Radix data attributes). Full `bg-primary` fill on radio (too heavy — a 65% centered dot is clearer).

## Decision #27 — 2026-02-27

**Context:** Building form components (Checkbox, RadioGroup, Switch, Select) that need rich accessibility — keyboard navigation, focus management, ARIA attributes, state management.
**Decision:** Use Radix UI 1.4.3 as the headless primitive layer. DS components wrap Radix with `forwardRef`, CVA variants, and Tailwind styling. Consumers import the DS facade — Radix is an internal dependency they never touch.
**Rationale:** Radix provides battle-tested accessibility for free. The unified `radix-ui` package is tree-shakeable. The `data-[state=*]` attributes map cleanly to Tailwind modifiers. The `asChild` pattern already matches our Button component's approach. Building these primitives from scratch would take weeks and produce worse accessibility.
**Alternatives considered:** Headless UI (fewer primitives, Tailwind-specific), React Aria (heavier, more opinionated), building from scratch (accessibility debt).

## Decision #26 — 2026-02-27

**Context:** Primary button dark mode — the dark end of `gradient-main` (`#141421`) is identical to the dark mode background, making the left edge of the button invisible. Tried various border stops (400–950) but none felt right. Initially overrode `--gradient-main` directly in `.theme-dark`, but this violated the three-layer architecture (Layer 1 values should not be theme-dependent).
**Decision:** Promote `--gradient-main` to a semantic token. Raw variants `--gradient-main-base` and `--gradient-main-dark` live in Layer 1 (`@theme`). Semantic alias `--gradient-main` lives in Layer 2 (`:root`/`.theme-dark`) and swaps per theme. No border needed — the gradient itself provides edge definition. Added `background-origin: border-box` to `.gradient-fill-*` classes to prevent artifacts at rounded corners with `border-transparent`.
**Rationale:** Follows the same promotion pattern as colors (`--color-primary-600` → `--primary`). `#1C1C32` is subtle — just enough lift from the dark mode background to define button edges. The `background-origin` fix prevents a mismatch between where the gradient is calculated (padding-box default) and where it paints (border-box). Added a "Promote Layer 1 to Layer 2" rule to ARCHITECTURE.md to catch this pattern proactively.

## Decision #24 — 2026-02-27

**Context:** Button variants (primary, secondary, outline) needed restyling to match Aleph Cloud brand identity.
**Decision:** Primary uses `gradient-fill-main` (dark→purple gradient), secondary uses `gradient-fill-lime` (lime→pale yellow), outline inherits the old secondary's `border-gradient-main` treatment. All three use `disabled:opacity-50` instead of per-property disabled states.
**Rationale:** The signature gradients are the core brand identity. Primary = authoritative dark-to-purple, secondary = bold lime accent, outline = gradient border for tertiary actions. Semi-transparent overlay hover states avoid maintaining separate gradient definitions per state. `disabled:opacity-50` works correctly with gradient backgrounds where individual property opacity would be impossible. Supersedes Decision #14 (gradient variants deferred).

## Decision #23 — 2026-02-27

**Context:** Preview app sidebar scrolls with page content instead of staying fixed.
**Decision:** Use `h-screen` on the outer layout wrapper with `overflow-hidden` on the content flex container. Sidebar and main each scroll independently within a viewport-locked box.
**Rationale:** `sticky` positioning failed because the parent flex container grows with page content — there's nothing to "stick" against. The fixed-height container approach keeps both panels in a viewport-sized box with independent overflow. No `sticky`/`position: fixed` needed.

## Decision #22 — 2026-02-27

**Context:** Color scale swatches on the preview colors page show no fill — just empty white boxes in both light and dark mode.
**Decision:** Use a static lookup map of Tailwind `bg-{color}-{stop}` class names instead of inline `style={{ backgroundColor: 'var(--color-...)' }}`.
**Rationale:** Tailwind CSS 4's `@theme` tree-shakes CSS custom properties not referenced by any utility class detected during source scanning. Inline `style` attributes with `var()` are invisible to the scanner, so the variables get pruned from the CSS output. Enumerating all class names in source code (even inside a data structure) is enough for the scanner to include them.

## Decision #21 — 2026-02-27

**Context:** Preview app typechecking fails because TypeScript follows DS source imports (via `transpilePackages`) and can't resolve the `@ac/*` alias used internally by DS components.
**Decision:** Add `@ac/*` path alias to the preview app's `tsconfig.json`, pointing to `../../packages/ds/src/*`.
**Rationale:** The preview app needs to understand DS internal aliases when typechecking transpiled source. This is a cross-workspace path resolution concern, not a design choice. The alternative (rewriting DS imports to relative paths) would break the DS package's own alias convention.

## Decision #20 — 2026-02-27

**Context:** Preview app navigation architecture — tabs vs sidebar + routes.
**Decision:** Sidebar with route-per-page using Next.js App Router file-based routing.
**Rationale:** Scales linearly as components are added (one file per page vs growing tab array). Supports deep-linking. Leverages App Router instead of fighting it. Each page is independently loadable.

## Decision #19 — 2026-02-27

**Context:** How the DS package exposes its API — barrel file vs deep imports.
**Decision:** Deep subpath exports: `@aleph-front/ds/button`, not `@aleph-front/ds`. No barrel files.
**Rationale:** Explicit, tree-shakeable, no barrel maintenance. Each export maps directly to a source file in `package.json` `"exports"`.

## Decision #18 — 2026-02-27

**Context:** Monorepo vs separate repos. Source exports vs compiled dist.
**Decision:** pnpm monorepo with source-level exports (raw `.tsx` via `"exports"` in `package.json`). Consumers compile with their own bundler via `transpilePackages`.
**Rationale:** One repo, one CI, workspace linking eliminates publish cycle friction. Source exports mean zero build step and instant feedback. All consumers are bundler-based (Next.js), so raw source works. A build step (tsup) can be added later if npm publishing requires it.
**Alternatives considered:** Separate repos (justified only at dedicated-team scale), compiled dist with tsup (unnecessary overhead for workspace consumers).

## Decision #17 — 2026-02-27

**Context:** Semantic token `--border` produces Tailwind class `border-border` (utility prefix + token name stutter).
**Decision:** Rename `--border`/`--border-hover` to `--edge`/`--edge-hover`. Add architecture rule: token names must not duplicate Tailwind utility prefixes.
**Rationale:** `border-edge` reads clearly. The rule prevents future collisions with `bg-`, `text-`, `shadow-`, `ring-`, `outline-` prefixes.

## Decision #16 — 2026-02-27

**Context:** Tailwind 4's `@utility` wraps `:hover` in `@media (hover: hover)`. Turbopack's CSS optimizer can't parse `var()` inside custom property assignments in that nesting, causing build errors. Also: Tailwind 4 auto-scans all project files for class names, including markdown docs with code examples.
**Decision:** Use plain CSS classes (not `@utility`) for gradient border effects. Bake interactive states into the class. Restrict Tailwind's content scanning to `src/` via `@source` in globals.css.
**Rationale:** Plain CSS `:hover` avoids Tailwind's media query wrapping. `@source` prevents doc examples from generating phantom CSS utilities.

## Decision #15 — 2026-02-27

**Context:** Secondary button needs a gradient border (`--gradient-main`), but CSS `border-color` doesn't accept gradients. The background-clip trick requires multiple CSS properties working together.
**Decision:** Define gradient border classes in `tokens.css`, colocated with the gradient tokens they consume. Never add component-level classes to `globals.css`.
**Rationale:** Keeps the token file as the single source for gradient-related styles. `globals.css` stays clean (imports, content sources, variant registrations, base element styles only).
**Alternatives considered:** Inline arbitrary values in CVA (works but unreadable), `@utility` (Turbopack can't parse `var()` in nested hover — see Decision #16)

## Decision #14 — 2026-02-26

**Context:** Gradient fill variants for primary/secondary buttons
**Decision:** Deferred — leave for later
**Rationale:** Gradient tokens exist but adding gradient variants to buttons adds complexity without a current need. Can be added as new variants when needed.

## Decision #13 — 2026-02-26

**Context:** `dark:` variant for class-based `.theme-dark` theming
**Decision:** Use `@custom-variant dark` in globals.css, keep `.theme-dark` class name
**Rationale:** Tailwind CSS 4's default `dark:` uses `prefers-color-scheme` media query, not class toggling. `@custom-variant` is the standard Tailwind mechanism for class-based dark mode — not a hack. Same pattern scales to future themes (contrast, warm, etc.).

## Decision #12 — 2026-02-26

**Context:** Destructive and warning button fill opacity
**Decision:** Use 20% opacity fill with dark text (light text in dark mode via `dark:` variant)
**Rationale:** Solid red/amber fills are visually aggressive for actions that aren't always dangerous. 20% opacity is subtler while the solid 3px border maintains definition. Text color adapts per theme for readability.

## Decision #11 — 2026-02-26

**Context:** Button visual style — border radius, padding, border, font weight
**Decision:** Pill shape (`rounded-full`), 3px border one stop lighter than fill, wider horizontal padding, `font-bold` (700)
**Rationale:** Font weight 700 matches the existing website. Pill shape and wider padding give buttons more presence. Lighter borders (not darker) avoid muddy appearance in dark mode.

## Decision #10 — 2026-02-26

**Context:** Whether to tokenize structural button properties (radii, heights, padding, font sizes)
**Decision:** Use plain Tailwind values, don't tokenize structural properties
**Rationale:** No rebrand has happened yet. Extracting to tokens later is a trivial mechanical refactor. Tokenizing now adds indirection, loses Tailwind autocomplete, and creates tokens that may never change. YAGNI.

## Decision #9 — 2026-02-26

**Context:** Button font family
**Decision:** Use `font-heading` (Rigid Square), `font-bold` (700), no italic
**Rationale:** Buttons are brand elements, not body text. The existing front-core also used a display font (Rubik bold) for buttons. Weight 700 matches the website. Italic reserved for headings.

## Decision #8 — 2026-02-26

**Context:** Polymorphic button rendering (`as="a"` vs `asChild`)
**Decision:** Use `asChild` pattern (React.cloneElement) instead of `as` prop
**Rationale:** Works with Next.js `<Link>`, router links, and any element without prop forwarding headaches. No Radix dependency — simple cloneElement implementation.

## Decision #7 — 2026-02-26

**Context:** Button variant architecture
**Decision:** CVA (Class Variance Authority) with 6 variants (primary, secondary, outline, text, destructive, warning) and 4 sizes (xs, sm, md, lg). No `color` prop — variant determines color.
**Rationale:** Variant-determines-color eliminates the combinatorial explosion of the old system (2 kinds × 4 variants × 8+ colors). CVA gives type-safe variant maps with zero runtime. Rebrand-safe because visual decisions live in the token layer.
**Alternatives considered:** Pure Tailwind maps (reinvents CVA), CSS Modules (doesn't leverage Tailwind utilities)

## Decision #6 — 2026-02-26

**Context:** Color token architecture for component library
**Decision:** Full OKLCH 50–950 scales for primary, accent, success, warning, error, neutral. Replace bare semantic tokens (`--primary`, etc.) with scales. No backward compatibility.
**Rationale:** Scales give components fine-grained color control. OKLCH enables Tailwind's `/opacity` modifier. No external consumers exist, so no backward compat needed — replace, don't deprecate.

## Decision #5 — 2026-02-26

**Context:** CSS import of token file
**Decision:** Use relative path (`../styles/tokens.css`) instead of path alias (`@ac/styles/tokens.css`)
**Rationale:** CSS `@import` is processed by PostCSS, which doesn't read tsconfig paths. Only TypeScript files benefit from the `@ac/*` alias.

## Decision #4 — 2026-02-26

**Context:** Module resolution for TypeScript
**Decision:** Use `module: "esnext"` and `moduleResolution: "bundler"` instead of `nodenext`
**Rationale:** Next.js uses a bundler (Turbopack/webpack), not Node's native module resolution. `nodenext` requires explicit file extensions and doesn't resolve tsconfig paths properly in a bundler context.

## Decision #3 — 2026-02-26

**Context:** Breakpoint values — front-core uses 576/992/1200/1400
**Decision:** Use Tailwind defaults (640/768/1024/1280/1536)
**Rationale:** Close enough that custom breakpoints aren't worth the complexity. Tailwind defaults are well-tested and documented.

## Decision #2 — 2026-02-26

**Context:** Color space for brand colors
**Decision:** OKLCH for brand colors, hex for semantic tokens
**Rationale:** OKLCH provides perceptually uniform color manipulation. Brand purple (#5100CD) converts cleanly. Hex used for semantic tokens because they're simpler static values.

## Decision #1 — 2026-02-26

**Context:** Choosing architecture for design token system
**Decision:** Three-layer Tailwind-first architecture (@theme + CSS custom properties + @theme inline)
**Rationale:** Lets all default Tailwind classes work out of the box while adding brand-specific tokens. CSS custom properties enable theme switching without JS runtime. Proven pattern from data-terminal project.
**Alternatives considered:** CSS-in-JS (styled-components — rejected, what we're replacing), standalone CSS variables without Tailwind integration
