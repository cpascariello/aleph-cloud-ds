# Aleph Cloud Design System

A design system built with Tailwind CSS 4 + CSS custom properties + OKLCH colors. Includes design tokens, fonts, reusable components, and a preview app.

## Design Methodology

### Principles

1. **Tokens first, components second.** Every visual decision (color, spacing, shadow, gradient) is a token before it's a component style. Components consume tokens — they never hardcode visual values. This means a rebrand changes one file (`tokens.css`), not every component.

2. **CSS-native theming.** Themes are CSS custom property swaps, not JS runtime logic. The browser handles theme transitions for free. No React context, no provider wrappers, no hydration mismatch. Toggle a class on `<html>` and every token resolves to its new value instantly.

3. **Tailwind as the utility layer, not the design language.** Tailwind classes are the delivery mechanism — the actual design lives in the token system. Components use Tailwind utilities to apply tokens, but the tokens define the visual language. This keeps the design system portable: if Tailwind is replaced, only the delivery layer changes.

4. **Accessibility is structural, not decorative.** Interactive components wrap Radix UI primitives that provide keyboard navigation, ARIA attributes, and focus management by default. Accessibility isn't added after the fact — it's the foundation the visual layer is painted on.

5. **No phantom features.** If a class, prop, or token doesn't resolve to working behavior, it's deleted. Dead code misleads both developers and tools. Better to have less that works than more that doesn't.

### Three-Layer Token Architecture

The token system has three layers, each with a distinct role:

| Layer | CSS Construct | Role | Example |
|-------|--------------|------|---------|
| **1. Brand** | `@theme { }` | Raw brand values — colors, gradients, fonts, shadows. Same in all themes. | `--color-primary-600: oklch(0.44 0.28 285.48)` |
| **2. Semantic** | `:root { }` / `.theme-dark { }` | Purpose-driven aliases that swap per theme. | `--primary: var(--color-primary-600)` (light) / `var(--color-primary-400)` (dark) |
| **3. Tailwind Bridge** | `@theme inline { }` | Maps semantic tokens into Tailwind's `--color-*` namespace so utilities like `bg-primary` resolve at runtime. | `--color-primary: var(--primary)` |

**Why three layers?** Layer 1 is the brand source of truth — it never changes between themes. Layer 2 is where theme-awareness lives — it decides which brand value to use in each context. Layer 3 is mechanical plumbing — it makes Tailwind utilities work with runtime CSS variables (via `inline`, which tells Tailwind to resolve at runtime instead of compile time).

**Promotion rule:** If a Layer 1 value needs to change per theme, it must be promoted to Layer 2. Example: `--gradient-main` has a dark endpoint that blends into the dark mode background, so it was promoted to a semantic token with per-theme variants.

### Component Architecture

Components follow a consistent pattern:

1. **CVA (Class Variance Authority)** defines variant maps — each variant is a key mapping to Tailwind class strings. TypeScript infers prop types from the variant keys automatically.

2. **`forwardRef`** on every component — consumers can attach refs for focus management, measurements, or integration with form libraries.

3. **`cn()` utility** (clsx + tailwind-merge) handles class composition. Always use `cn()` instead of template literals to ensure Tailwind conflict resolution.

4. **Radix UI wrappers** for interactive controls. The DS component is the public API; Radix is an internal implementation detail consumers never import directly.

5. **Flat props over compound children.** Where Radix uses nested `<Item>` components (like Select), the DS wrapper accepts a flat `options` array. This simplifies the consumer API at the cost of flexibility — a tradeoff that's right for most use cases.

### Color Space

All color scales use **OKLCH** — a perceptually uniform color space where equal numeric steps produce equal visual contrast steps. This means a 100-unit jump from `primary-400` to `primary-500` looks the same as from `primary-700` to `primary-800`, unlike HSL where lightness perception varies by hue.

OKLCH also enables Tailwind's `/opacity` modifier (`bg-primary-600/50`) because the color components are expressed independently.

### Testing Philosophy

Test **behavior and accessibility**, not appearance. The preview app is the visual test suite. Automated tests verify:

- Interactive logic (loading state shows spinner, hides icons)
- Accessibility attributes (`aria-invalid`, `aria-busy`, `disabled`)
- DOM structure (polymorphic rendering, prop forwarding)
- Edge cases (empty states, disabled interactions)

Tests never assert CSS class names — those are implementation details that break on every visual redesign without catching real bugs.

---

## Installation

Install the DS package in your app:

```bash
pnpm add @aleph-front/ds
```

Import tokens in your CSS and components via subpath exports:

```css
@import "tailwindcss";
@import "@aleph-front/ds/styles/tokens.css";

@custom-variant dark (&:where(.theme-dark, .theme-dark *));
```

```tsx
import { Button } from "@aleph-front/ds/button";
import { Input } from "@aleph-front/ds/input";
import { cn } from "@aleph-front/ds/lib/cn";
```

Consumer apps need `transpilePackages: ["@aleph-front/ds"]` in their Next.js config (DS exports raw `.tsx` source).

## Themes

Two themes applied via class on `<html>`. Default: light (no class). Dark: `.theme-dark`.

| Theme | Class | Aesthetic |
|-------|-------|-----------|
| Light | (none) | Violet-tinted whites, dark text |
| Dark | `.theme-dark` | Deep purple-black, light text |

Toggle theme in JS:

```ts
document.documentElement.classList.toggle("theme-dark");
```

---

## Color Tokens

Use as Tailwind classes. Semantic tokens resolve to different values per theme.

### Color Scales

Full OKLCH 50–950 scales. Each scale has 11 stops, available as Tailwind classes like `bg-primary-600`, `text-error-500`, etc. Supports `/opacity` modifier: `bg-primary-600/50`.

| Scale | Hue | Anchor | Use for |
|-------|-----|--------|---------|
| `primary` | 285.48 (purple) | 600 = brand #5100CD | Brand identity, primary actions |
| `accent` | 121.30 (lime) | 300 = brand #D4FF00 | Accents, highlights, CTAs |
| `success` | 145 (green) | 500 = #36D846 | Success states |
| `warning` | 75 (amber) | 500 = #FBAE18 | Warning states |
| `error` | 12 (red) | 600 = #DE3668 | Error states |
| `destructive` | (alias → `error`) | — | Convenience alias for shadcn/Tailwind convention |
| `neutral` | 265 (purple-tinted gray) | — | Borders, backgrounds, text |
| `base` | 280 (dark indigo) | — | Dark surface palette (tone-sur-tone with `#141421`) |

### Semantic Colors

Swap automatically between light and dark themes.

| Token | Tailwind class | Light | Dark | Use for |
|-------|---------------|-------|------|---------|
| `background` | `bg-background` | `#F9F4FF` | `#141421` | Page background |
| `foreground` | `text-foreground` | `#141421` | `#F9F4FF` | Primary text |
| `primary` | `bg-primary`, `text-primary` | primary-600 | primary-400 | Interactive elements |
| `primary-foreground` | `text-primary-foreground` | `#ffffff` | `#ffffff` | Text on primary backgrounds |
| `accent` | `bg-accent`, `text-accent` | accent-300 | accent-300 | Highlights, emphasis |
| `accent-foreground` | `text-accent-foreground` | `#141421` | `#141421` | Text on accent backgrounds |
| `muted` | `bg-muted` | primary-100 | base-900 | Subdued backgrounds |
| `muted-foreground` | `text-muted-foreground` | neutral-500 | neutral-400 | Subdued text, labels |
| `surface` | `bg-surface` | primary-50 | base-900 | Elevated/interactive surface backgrounds (cards, form fields) |
| `surface-foreground` | `text-surface-foreground` | `#141421` | `#F9F4FF` | Text on elevated surfaces |
| `edge` | `border-edge` | primary-200 | base-800 | Borders, dividers |
| `edge-hover` | `border-edge-hover` | primary-300 | base-700 | Hover state borders |

### Usage Examples

```tsx
{/* Scale colors — use specific stops for fine control */}
<div className="bg-primary-100 text-primary-800 p-4 rounded">Light tint</div>
<div className="bg-error-600 text-white p-4 rounded">Error</div>
<div className="bg-neutral-50 border border-neutral-200 p-4 rounded">Subtle</div>

{/* Opacity modifier */}
<div className="bg-primary-600/20 text-primary-700 p-4 rounded">20% opacity</div>

{/* Semantic colors — theme-aware */}
<div className="bg-surface text-surface-foreground rounded-lg border border-edge p-6">
  <h3 className="text-foreground font-bold">Title</h3>
  <p className="text-muted-foreground">Description text</p>
</div>
```

---

## Fonts

| Tailwind class | Font | Source | Use for |
|----------------|------|--------|---------|
| `font-heading` | rigid-square | Adobe Typekit (`acb7qvn`) | Headings, hero text |
| `font-sans` | Titillium Web | Google Fonts | Body text |
| `font-mono` | Source Code Pro | Google Fonts | Code blocks |

### Heading Scale

All headings use `font-heading`, weight 800, italic.

| Style | Size | Tailwind equivalent |
|-------|------|-------------------|
| Header | 128px (8rem) | `text-[8rem]` |
| H1 | 72px (4.5rem) | `text-[4.5rem]` |
| H2 | 64px (4rem) | `text-[4rem]` |
| H3 | 48px (3rem) | `text-5xl` |
| H4 | 40px (2.5rem) | `text-[2.5rem]` |
| H5 | 36px (2.25rem) | `text-4xl` |
| H6 | 32px (2rem) | `text-[2rem]` |
| H7 | 24px (1.5rem) | `text-2xl` |

### Body Styles

| Style | Class combination |
|-------|------------------|
| Body | `font-sans text-base leading-relaxed` |
| Body bold | `font-sans text-base font-bold leading-relaxed` |
| Body italic | `font-sans text-base italic leading-relaxed` |
| Code | `font-mono text-base leading-relaxed` |

### Usage Examples

```tsx
{/* Page heading */}
<h1 className="font-heading text-[4.5rem] font-extrabold italic">
  Aleph Cloud
</h1>

{/* Section heading */}
<h2 className="font-heading text-[2rem] font-extrabold italic">
  Features
</h2>

{/* Body text */}
<p className="font-sans text-base leading-relaxed">
  Decentralized computing for everyone.
</p>

{/* Code block */}
<pre className="font-mono text-base leading-relaxed bg-muted p-4 rounded-lg">
  const node = await aleph.create({ channel: "main" });
</pre>
```

---

## Gradients

Available as CSS custom properties. Use via `style` attribute.

| Name | CSS variable | Colors | Use for |
|------|-------------|--------|---------|
| `main` | `var(--gradient-main)` | `#141421` → `#5100CD` (light) / `#1C1C32` → `#5100CD` (dark) | Primary gradient, hero sections. Theme-aware — promoted to semantic layer. |
| `lime` | `var(--gradient-lime)` | `#D6FF00` → `#F5F7DB` | Accent gradient, CTAs |
| `success` | `var(--gradient-success)` | `#36D846` → `#63E570` | Success states |
| `warning` | `var(--gradient-warning)` | `#FFE814` → `#FBAE18` | Warning states |
| `error` | `var(--gradient-error)` | `#FFAC89` → `#DE3668` | Error states |
| `destructive` | `var(--gradient-destructive)` | (alias → `error`) | Convenience alias |
| `info` | `var(--gradient-info)` | `#C8ADF0` → `#5100CD` | Info states |

### Gradient Border Utilities

CSS `border-color` doesn't support gradients. These classes (defined in `tokens.css`) use the background-clip trick to render gradient borders with rounded corners. Interactive states (hover, active) are built into the class.

| Class | Gradient | Fill (default → hover → active) |
|-------|----------|--------------------------------|
| `border-gradient-main` | `--gradient-main` | primary-100 → 200 → 300 |

```tsx
{/* Just apply the class — hover/active fills are built in */}
<button className="border-gradient-main border-3 rounded-full">
  Outline Action
</button>
```

### Gradient Fill Utilities

CSS classes for gradient backgrounds with interactive hover/active states. Hover uses a semi-transparent overlay to lighten or darken the gradient without defining new color stops.

| Class | Gradient | Hover | Active |
|-------|----------|-------|--------|
| `gradient-fill-main` | `--gradient-main` | White overlay (lighten) | Black overlay (darken) |
| `gradient-fill-lime` | `--gradient-lime` | Black overlay (subtle darken) | Black overlay (darken) |

```tsx
{/* Gradient fills with built-in hover/active states */}
<button className="gradient-fill-main text-white px-6 py-3 rounded-full">
  Primary Action
</button>
<button className="gradient-fill-lime text-neutral-950 px-6 py-3 rounded-full">
  Secondary Action
</button>
```

### Usage Examples

```tsx
{/* Hero section with main gradient */}
<div style={{ background: "var(--gradient-main)" }} className="text-white p-12 rounded-lg">
  <h1 className="font-heading text-4xl font-extrabold italic">Welcome</h1>
</div>

{/* CTA button with lime gradient */}
<button
  style={{ background: "var(--gradient-lime)" }}
  className="text-black px-6 py-3 rounded-md font-bold"
>
  Get Started
</button>

{/* Status banner */}
<div style={{ background: "var(--gradient-success)" }} className="text-white px-4 py-2 rounded">
  All systems operational
</div>
```

---

## Shadows

Available as Tailwind utility classes.

| Name | Tailwind class | Value | Use for |
|------|---------------|-------|---------|
| `brand-sm` | `shadow-brand-sm` | `0px 4px 4px` (15% brand) | Tight elements (tooltips, hover accents) |
| `brand` | `shadow-brand` | `0px 4px 24px` (10% brand) | Default surface shadow (form fields, dropdowns) |
| `brand-lg` | `shadow-brand-lg` | `0px 4px 48px` (25% brand) | Emphasized elements, modals |

### Usage Examples

```tsx
{/* Card with subtle shadow */}
<div className="bg-surface rounded-lg p-6 shadow-brand-sm">
  Subtle card
</div>

{/* Elevated card */}
<div className="bg-surface rounded-lg p-6 shadow-brand">
  Default elevation
</div>

{/* Modal or hero element */}
<div className="bg-surface rounded-lg p-8 shadow-brand-lg">
  High emphasis
</div>

{/* Interactive shadow on hover */}
<div className="bg-surface rounded-lg p-6 shadow-brand-sm hover:shadow-brand transition-shadow">
  Hover for more shadow
</div>
```

---

## Transitions

Available as CSS custom properties.

| Name | CSS variable | Duration | Use for |
|------|-------------|----------|---------|
| Fast | `var(--duration-fast)` | 200ms | Hover states, micro-interactions |
| Normal | `var(--duration-normal)` | 500ms | Panel transitions, reveals |
| Slow | `var(--duration-slow)` | 700ms | Page transitions, complex animations |

Timing function: `var(--timing)` = `ease-in-out`

### Usage Examples

```tsx
{/* Fast hover transition */}
<button
  className="border border-edge hover:border-edge-hover transition-colors"
  style={{ transitionDuration: "var(--duration-fast)" }}
>
  Hover me
</button>

{/* Animated panel */}
<div
  className="transition-all"
  style={{
    transitionDuration: "var(--duration-normal)",
    transitionTimingFunction: "var(--timing)",
  }}
>
  Animated content
</div>
```

---

## Breakpoints

Uses Tailwind defaults. No custom breakpoints.

| Name | Min-width | CSS |
|------|-----------|-----|
| `sm` | 640px | `@media (min-width: 640px)` |
| `md` | 768px | `@media (min-width: 768px)` |
| `lg` | 1024px | `@media (min-width: 1024px)` |
| `xl` | 1280px | `@media (min-width: 1280px)` |
| `2xl` | 1536px | `@media (min-width: 1536px)` |

---

## Icon Sizes

Size tokens for consistent icon sizing. No icon library included yet.

| Name | Size |
|------|------|
| `2xl` | 36px |
| `xl` | 24px |
| `lg` | 16px |
| `md` | 14px |
| `sm` | 12px |
| `xs` | 8px |

---

## Patterns

### Adding a New Semantic Token

1. Add light value to `:root` block in `packages/ds/src/styles/tokens.css`
2. Add dark value to `.theme-dark` block
3. Add Tailwind mapping in `@theme inline` block: `--color-my-token: var(--my-token);`
4. Use as Tailwind class: `bg-my-token`, `text-my-token`, `border-my-token`

### Composing a Card

```tsx
<div className="bg-surface text-surface-foreground rounded-lg border border-edge
                shadow-brand-sm hover:shadow-brand p-6"
     style={{ transitionDuration: "var(--duration-fast)" }}>
  <h3 className="font-heading text-xl font-extrabold italic mb-2">
    Card Title
  </h3>
  <p className="text-muted-foreground leading-relaxed">
    Card description with muted text.
  </p>
  <button className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-md">
    Action
  </button>
</div>
```

### Hero Section

```tsx
<section style={{ background: "var(--gradient-main)" }} className="py-24 px-6">
  <div className="mx-auto max-w-5xl">
    <h1 className="font-heading text-[4.5rem] font-extrabold italic text-white">
      Aleph Cloud
    </h1>
    <p className="font-sans text-xl text-white/80 mt-4 max-w-2xl leading-relaxed">
      Decentralized computing, storage, and networking.
    </p>
    <button
      style={{ background: "var(--gradient-lime)" }}
      className="mt-8 text-black px-8 py-3 rounded-md font-bold text-lg shadow-brand-lg"
    >
      Get Started
    </button>
  </div>
</section>
```

### Status Indicator

```tsx
<div className="flex items-center gap-2">
  <div className="w-2 h-2 rounded-full bg-success-500" />
  <span className="text-sm text-muted-foreground">All systems operational</span>
</div>
```

---

## Components

### Button

CVA-based button with 6 variants, 4 sizes, icon slots, loading/disabled states, and `asChild` polymorphism.

```tsx
import { Button } from "@aleph-front/ds/button";
```

**Visual style:** Pill shape (`rounded-full`), 3px border, `font-heading` at weight 700.

#### Variants

```tsx
<Button variant="primary">Primary</Button>     {/* gradient-main fill, white text, no border */}
<Button variant="secondary">Secondary</Button> {/* gradient-lime fill, black text, black border */}
<Button variant="outline">Outline</Button>     {/* gradient-main border, primary-100 fill */}
<Button variant="text">Text</Button>           {/* transparent, no visible border */}
<Button variant="destructive">Delete</Button>  {/* 20% error fill, dark text (light in dark mode) */}
<Button variant="warning">Careful</Button>     {/* 20% warning fill, dark text (light in dark mode) */}
```

#### Sizes

```tsx
<Button size="xs">Extra Small</Button>  {/* py-1, text-sm */}
<Button size="sm">Small</Button>        {/* py-1.5, text-base */}
<Button size="md">Medium</Button>       {/* py-2, text-base (default) */}
<Button size="lg">Large</Button>        {/* py-2.5, text-lg */}
```

#### Icons

```tsx
<Button iconLeft={<PlusIcon />}>Add Item</Button>
<Button iconRight={<ArrowIcon />}>Next</Button>
<Button iconLeft={<PlusIcon />} iconRight={<ArrowIcon />}>Both</Button>
```

#### Loading and Disabled

```tsx
<Button loading>Saving...</Button>   {/* Shows spinner, hides icons, aria-busy */}
<Button disabled>Unavailable</Button> {/* 50% opacity, pointer-events-none */}
```

#### As Link (asChild)

Renders button styles on a child element instead of `<button>`:

```tsx
<Button asChild variant="primary">
  <a href="/dashboard">Go to Dashboard</a>
</Button>

{/* Works with Next.js Link */}
<Button asChild variant="text">
  <Link href="/settings">Settings</Link>
</Button>
```

#### Custom Composition with buttonVariants

```tsx
import { buttonVariants } from "@aleph-front/ds/button";

<a href="/docs" className={buttonVariants({ variant: "outline", size: "sm" })}>
  Documentation
</a>
```

### Input

Styled text input with CVA sizing and error state.

```tsx
import { Input } from "@aleph-front/ds/input";

<Input size="md" placeholder="Enter text" />
<Input size="sm" placeholder="Small" />
<Input error placeholder="Invalid" />
<Input disabled placeholder="Disabled" />
```

**Sizes:** `sm` (py-1.5, text-sm) · `md` (py-2, text-base, default)

**Visuals:** Borderless with `shadow-brand` (purple-tinted shadow). `rounded-full` pill shape. Dark mode uses `bg-base-800` for a slightly elevated fill.

**Error:** `error={true}` adds 3px `border-error-400` border, sets `aria-invalid`.

**Focus ring:** Flush `ring-3` in `primary-500`, animated via `box-shadow` transition. No offset.

### Textarea

Multi-line text input. Same API as Input, `rounded-2xl`, `shadow-brand`, vertical resize. Dark mode uses `bg-base-800`.

```tsx
import { Textarea } from "@aleph-front/ds/textarea";

<Textarea placeholder="Enter message" />
<Textarea size="sm" rows={6} />
<Textarea error placeholder="Invalid" />
```

**Defaults:** `rows={4}`, `resize-y`, `size="md"`

### FormField

Layout wrapper that wires label, helper text, and error message to a child input with proper accessibility attributes.

```tsx
import { FormField } from "@aleph-front/ds/form-field";
import { Input } from "@aleph-front/ds/input";

<FormField label="Email" required helperText="We'll never share it">
  <Input type="email" placeholder="you@example.com" />
</FormField>

<FormField label="Email" required error="Invalid email">
  <Input type="email" error />
</FormField>
```

**Props:** `label` (required), `required`, `helperText`, `error`, `className`

**Accessibility:** Auto-generates `id`, wires `htmlFor`, `aria-describedby`, and `role="alert"` on errors. When `error` is present, auto-injects `error={true}` and `aria-invalid={true}` into the child input via `cloneElement` — no need to pass `error` to both FormField and Input.

### Checkbox

Toggle control for boolean values. Wraps Radix UI Checkbox with CVA styling.

```tsx
import { Checkbox } from "@aleph-front/ds/checkbox";

<Checkbox />
<Checkbox defaultChecked />
<Checkbox checked={value} onCheckedChange={setValue} />
<Checkbox disabled />
<Checkbox error />
<Checkbox size="sm" />

<FormField label="Accept terms" required>
  <Checkbox />
</FormField>
```

**Props:** `checked`, `defaultChecked`, `onCheckedChange`, `disabled`, `error`, `size` (xs/sm/md), `className`. Forwards ref to `<button>`.

**Sizes:** `xs` (16px, rounded 4px) · `sm` (24px, rounded-md 6px) · `md` (28px, rounded-md 6px, default)

**Animation:** Check icon reveals with a clip-path circle transition (200ms, bottom-left origin following stroke direction). Uses Radix `forceMount` to keep indicator in DOM.

**Error:** `error={true}` switches to 3px `border-error-400` border, sets `aria-invalid`.

### RadioGroup

Mutually exclusive option set. Wraps Radix UI RadioGroup with CVA styling.

```tsx
import { RadioGroup, RadioGroupItem } from "@aleph-front/ds/radio-group";

<RadioGroup defaultValue="a" onValueChange={setValue}>
  <RadioGroupItem value="a" />
  <RadioGroupItem value="b" />
  <RadioGroupItem value="c" disabled />
</RadioGroup>

<FormField label="Plan" required>
  <RadioGroup defaultValue="starter">
    <RadioGroupItem value="starter" />
    <RadioGroupItem value="pro" />
  </RadioGroup>
</FormField>
```

**RadioGroup props:** `value`, `defaultValue`, `onValueChange`, `disabled`, `className`. Forwards ref to `<div>`.

**RadioGroupItem props:** `value`, `disabled`, `size` (xs/sm/md), `className`. Forwards ref to `<button>`.

**Sizes:** `xs` (16px) · `sm` (24px) · `md` (28px, default)

**Animation:** Dot reveals with a clip-path circle transition (200ms, centered origin). Uses Radix `forceMount` to keep indicator in DOM.

### Switch

Toggle control for on/off states. Wraps Radix UI Switch with CVA styling and animated thumb.

```tsx
import { Switch } from "@aleph-front/ds/switch";

<Switch />
<Switch defaultChecked />
<Switch checked={value} onCheckedChange={setValue} />
<Switch disabled />
<Switch size="sm" />

<FormField label="Email notifications">
  <Switch />
</FormField>
```

**Props:** `checked`, `defaultChecked`, `onCheckedChange`, `disabled`, `size` (xs/sm/md), `className`. Forwards ref to `<button>`.

**Sizes:** `xs` (36×20px track, 12px thumb) · `sm` (48×26px track, 18px thumb) · `md` (60×32px track, 24px thumb, default)

**Visuals:** Pill track, sliding white thumb with `transition-transform`, 2px gap from track edges. Off = `bg-muted border-edge`, on = `bg-primary`.

### Select

Dropdown selector. Wraps Radix UI Select with flat `options` prop API.

```tsx
import { Select } from "@aleph-front/ds/select";

<Select
  placeholder="Choose..."
  options={[
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
    { value: "c", label: "Option C", disabled: true },
  ]}
/>
<Select value={value} onValueChange={setValue} options={options} />
<Select disabled options={options} />
<Select error options={options} />

<FormField label="Region" required error="Required">
  <Select error placeholder="Select region" options={regions} />
</FormField>
```

**Props:** `value`, `defaultValue`, `onValueChange`, `placeholder`, `options` (array of `{ value, label, disabled? }`), `disabled`, `error`, `size` (sm/md), `className`, `id`, `aria-describedby`. Forwards ref to trigger `<button>`.

**Sizes:** `sm` (Input sm padding) · `md` (Input md padding, default)

**Visuals:** Borderless with `shadow-brand`, matching Input/Textarea. `rounded-full` pill shape. Dark mode uses `bg-base-800`.

**Error:** `error={true}` adds 3px `border-error-400` border, sets `aria-invalid`.

**Dropdown:** `rounded-2xl`, `bg-surface`, `border border-edge`, `shadow-brand`. Items highlight with `bg-muted`. Selected shows check icon.

### Badge

Semantic label for status, counts, and categories. Subtle rounded corners (`rounded`, 4px) with color variants.

```tsx
import { Badge } from "@aleph-front/ds/badge";
```

#### Variants

```tsx
<Badge variant="default">Default</Badge>   {/* primary-100/700 bg/text */}
<Badge variant="success">Healthy</Badge>   {/* success-100/700 bg/text */}
<Badge variant="warning">Degraded</Badge>  {/* warning-100/800 bg/text */}
<Badge variant="error">Offline</Badge>     {/* error-100/700 bg/text */}
<Badge variant="info">3 VMs</Badge>        {/* neutral-100/700 bg/text */}
```

#### Sizes

```tsx
<Badge size="sm">Small</Badge>  {/* px-2, text-xs */}
<Badge size="md">Medium</Badge> {/* px-2.5, text-sm (default) */}
```

#### Custom Composition with badgeVariants

```tsx
import { badgeVariants } from "@aleph-front/ds/badge";

<span className={badgeVariants({ variant: "success", size: "sm" })}>Active</span>
```

### Card

Content container with semantic background and border. Used for stat cards, panels, and layout grouping.

```tsx
import { Card } from "@aleph-front/ds/card";
```

#### Variants

```tsx
<Card variant="default">Bordered card</Card>  {/* bg-surface, border-edge, rounded-xl */}
<Card variant="noise">Grain texture</Card>    {/* purple grain SVG overlay */}
<Card variant="ghost">No border</Card>        {/* transparent, no border */}
```

#### Padding

```tsx
<Card padding="sm">Compact</Card>  {/* p-4 */}
<Card padding="md">Medium</Card>   {/* p-6 (default) */}
<Card padding="lg">Spacious</Card> {/* p-8 */}
```

#### With Title

```tsx
<Card title="Node Health">
  <p>Card content below the heading.</p>
</Card>
```

Renders an `<h3>` heading with `font-heading` and `mb-4` spacing.

### StatusDot

Small colored circle indicating health status. Used inline with text labels in tables and lists. Accessible by default — includes `role="status"` and auto-derived `aria-label` from the status prop.

```tsx
import { StatusDot } from "@aleph-front/ds/status-dot";
```

#### Statuses

```tsx
<StatusDot status="healthy" />   {/* success-500, pulse animation */}
<StatusDot status="degraded" />  {/* warning-500 */}
<StatusDot status="error" />     {/* error-500 */}
<StatusDot status="offline" />   {/* neutral-400 */}
<StatusDot status="unknown" />   {/* neutral-300 */}
```

#### Sizes

```tsx
<StatusDot status="healthy" size="sm" />  {/* 8px (size-2) */}
<StatusDot status="healthy" size="md" />  {/* 12px (size-3, default) */}
```

**Accessibility:** Built-in `role="status"` and auto-derived `aria-label` (e.g., `status="healthy"` → `aria-label="Healthy"`). Override with a custom label when more context is needed:

```tsx
<StatusDot status="healthy" aria-label="Node is healthy" />
```

### Table

Generic typed table with sortable columns, alternating rows, hover highlight, row click, keyboard accessibility, and empty state.

```tsx
import { Table, type Column } from "@aleph-front/ds/table";
```

#### Column Definition

```tsx
type Column<T> = {
  header: string;            // Column header text
  accessor: (row: T) => ReactNode;  // Cell renderer
  sortable?: boolean;        // Enable sort on this column
  sortValue?: (row: T) => string | number;  // Sort comparator
  width?: string;            // CSS width
  align?: "left" | "center" | "right";
};
```

#### Usage

```tsx
const columns: Column<Node>[] = [
  { header: "Name", accessor: (r) => r.name, sortable: true, sortValue: (r) => r.name },
  { header: "CPU", accessor: (r) => `${r.cpu}%`, sortable: true, sortValue: (r) => r.cpu, align: "right" },
];

<Table
  columns={columns}
  data={nodes}
  keyExtractor={(r) => r.id}
  onRowClick={(row) => setSelected(row)}
  emptyState="No nodes found"
/>
```

**Visual style:** Alternating rows (`even:bg-muted/30`), hover highlight (`hover:bg-muted/50`), clickable rows with `cursor-pointer`. Header row `bg-muted/50 text-muted-foreground text-sm font-semibold uppercase tracking-wide`.

**Keyboard accessibility:** Sortable headers are focusable (`tabIndex={0}`) and respond to Enter/Space. Clickable rows are focusable and respond to Enter. Headers include `aria-sort` (`ascending`/`descending`/`none`).

**Empty state:** Pass `emptyState` (ReactNode) to render a centered message spanning all columns when `data` is empty.

### Tooltip

Radix UI tooltip wrapper with DS styling. Composable API with four exports.

```tsx
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@aleph-front/ds/tooltip";
```

#### Usage

Wrap your app (or a subtree) with `TooltipProvider`, then compose tooltips:

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <button>Hover me</button>
    </TooltipTrigger>
    <TooltipContent>Tooltip text</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

#### Placement

```tsx
<TooltipContent side="top" />     {/* default */}
<TooltipContent side="right" />
<TooltipContent side="bottom" />
<TooltipContent side="left" />
```

**Styling:** `bg-neutral-900 text-white text-sm rounded-lg px-3 py-1.5 shadow-brand-sm` with Radix animation attributes. Dark mode uses `bg-base-700` for contrast against the dark page background.

### Skeleton

Animated loading placeholder. No width/height props — sizing is controlled by the consumer via `className`.

```tsx
import { Skeleton } from "@aleph-front/ds/ui/skeleton";

<Skeleton className="h-4 w-32" />           {/* Text line */}
<Skeleton className="h-10 w-full" />         {/* Input field */}
<Skeleton className="size-12 rounded-full" /> {/* Avatar */}
```

Uses `animate-pulse bg-muted rounded-md`. Hidden from accessibility tree via `aria-hidden="true"`. Respects `prefers-reduced-motion` via `motion-reduce:animate-none`.

### Spinner

Animated loading indicator. Used internally by Button but available standalone.

```tsx
import { Spinner } from "@aleph-front/ds/ui/spinner";

<Spinner className="size-5 text-primary-600" />
```

---

## Token File Reference

All tokens live in `packages/ds/src/styles/tokens.css`. Three layers:

| Layer | CSS construct | Purpose |
|-------|--------------|---------|
| 1. Brand | `@theme { }` | Raw brand values (colors, gradients, shadows, fonts) — extends Tailwind |
| 2. Semantic | `:root { }` / `.theme-dark { }` | Purpose-driven tokens that swap per theme |
| 3. Tailwind bridge | `@theme inline { }` | Maps semantic tokens to Tailwind's `--color-*` namespace |

To modify tokens, edit `packages/ds/src/styles/tokens.css` directly. Changes propagate to all Tailwind classes automatically.

---

## Preview App

Run `pnpm dev` and visit http://localhost:3000. Sidebar navigation with route-per-page:

| Route | Content |
|-------|---------|
| `/` | Overview — foundation cards, component list |
| `/foundations/colors` | OKLCH color scales (50–950), semantic tokens, borders |
| `/foundations/typography` | Heading scale (Header–H7), body styles, font families |
| `/foundations/spacing` | Spacing scale, breakpoints table, border radius |
| `/foundations/effects` | Shadow tokens, gradient swatches, transition demos |
| `/foundations/icons` | Icon size tokens |
| `/components/badge` | Variants, sizes, real-world examples |
| `/components/button` | Variants, sizes, icons, loading, disabled, asChild |
| `/components/card` | Default/ghost variants, padding sizes, stat card composition |
| `/components/input` | Sizes and states |
| `/components/textarea` | Default, error, disabled |
| `/components/checkbox` | Default, sizes, states, controlled, FormField |
| `/components/radio-group` | Default, sizes, states, controlled, FormField |
| `/components/switch` | Default, sizes, disabled, controlled, FormField |
| `/components/select` | Default, sizes, states, controlled, FormField |
| `/components/form-field` | Label, helper text, error |
| `/components/skeleton` | Basic shapes, card loading, table row loading |
| `/components/table` | Sorting, row click, DS component composition |
| `/components/status-dot` | Statuses, sizes, inline usage |
| `/components/tooltip` | Basic, sides, truncated hash example |

Theme switcher in the sticky header toggles light/dark. Responsive layout with mobile drawer navigation (below `lg` breakpoint) and fixed desktop sidebar (`lg+`).

### Motion Sensitivity

All animated components respect `prefers-reduced-motion: reduce` via Tailwind's `motion-reduce:` variant:
- **Continuous animations** (pulse, spin): Disabled entirely with `motion-reduce:animate-none` (Skeleton, Spinner, StatusDot healthy pulse)
- **One-shot transitions** (clip-path, transform): Disabled with `motion-reduce:transition-none` (Checkbox, RadioGroup, Switch, Tooltip, Table sort chevron)
