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
