# Aleph Cloud Design System

A tokens-only design system built with Tailwind CSS 4 + CSS custom properties + OKLCH colors. No components yet — just tokens, fonts, and a preview app.

## Setup

Import the global stylesheet in your root layout. All tokens are available as Tailwind utility classes.

```tsx
// src/app/layout.tsx
import "./globals.css";
```

`globals.css` imports Tailwind and the token file:

```css
@import "tailwindcss";
@import "../styles/tokens.css";
```

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

Or use the built-in `ThemeSwitcher` component:

```tsx
import { ThemeSwitcher } from "@ac/components/theme-switcher";

<ThemeSwitcher />
```

---

## Color Tokens

Use as Tailwind classes. Semantic tokens resolve to different values per theme.

### Brand Colors

Fixed across themes. These extend Tailwind's palette.

| Token | Tailwind class | Hex | OKLCH | Use for |
|-------|---------------|-----|-------|---------|
| `brand` | `bg-brand`, `text-brand` | `#5100CD` | `oklch(0.372 0.254 285.48)` | Brand identity, primary actions |
| `brand-lime` | `bg-brand-lime`, `text-brand-lime` | `#D4FF00` | `oklch(0.929 0.228 121.30)` | Accents, highlights, CTAs |

### Semantic Colors

Swap automatically between light and dark themes.

| Token | Tailwind class | Light | Dark | Use for |
|-------|---------------|-------|------|---------|
| `background` | `bg-background` | `#F9F4FF` | `#141421` | Page background |
| `foreground` | `text-foreground` | `#141421` | `#F9F4FF` | Primary text |
| `primary` | `bg-primary`, `text-primary` | brand | brand (lighter) | Interactive elements |
| `primary-foreground` | `text-primary-foreground` | `#ffffff` | `#ffffff` | Text on primary backgrounds |
| `accent` | `bg-accent`, `text-accent` | brand-lime | brand-lime | Highlights, emphasis |
| `accent-foreground` | `text-accent-foreground` | `#141421` | `#141421` | Text on accent backgrounds |
| `muted` | `bg-muted` | `#F3E8FF` | `#1E1E2E` | Subdued backgrounds |
| `muted-foreground` | `text-muted-foreground` | `#6B7280` | `#9CA3AF` | Subdued text, labels |
| `card` | `bg-card` | `#ffffff` | `#1E1E2E` | Card/panel backgrounds |
| `card-foreground` | `text-card-foreground` | `#141421` | `#F9F4FF` | Card text |
| `border` | `border-border` | `#E9D5FF` | `#2E2E3E` | Borders, dividers |
| `border-hover` | `border-border-hover` | `#D8B4FE` | `#3E3E4E` | Hover state borders |

### Status Colors

Fixed across themes.

| Token | Tailwind class | Hex | Use for |
|-------|---------------|-----|---------|
| `success` | `bg-success`, `text-success` | `#36D846` | Success states |
| `warning` | `bg-warning`, `text-warning` | `#FBAE18` | Warning states |
| `error` | `bg-error`, `text-error` | `#DE3668` | Error states |

### Usage Examples

```tsx
{/* Card with theme-aware colors */}
<div className="bg-card text-card-foreground rounded-lg border border-border p-6">
  <h3 className="text-foreground font-bold">Title</h3>
  <p className="text-muted-foreground">Description text</p>
</div>

{/* Primary action button */}
<button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
  Deploy
</button>

{/* Accent highlight */}
<span className="bg-accent text-accent-foreground px-2 py-0.5 rounded">
  NEW
</span>

{/* Status badges */}
<span className="bg-success text-white px-2 py-0.5 rounded text-sm">Online</span>
<span className="bg-error text-white px-2 py-0.5 rounded text-sm">Failed</span>
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
| `main` | `var(--gradient-main)` | `#141421` → `#5100CD` | Primary gradient, hero sections |
| `lime` | `var(--gradient-lime)` | `#D6FF00` → `#F5F7DB` | Accent gradient, CTAs |
| `success` | `var(--gradient-success)` | `#36D846` → `#63E570` | Success states |
| `warning` | `var(--gradient-warning)` | `#FFE814` → `#FBAE18` | Warning states |
| `error` | `var(--gradient-error)` | `#FFAC89` → `#DE3668` | Error states |
| `info` | `var(--gradient-info)` | `#C8ADF0` → `#5100CD` | Info states |

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
| `brand-sm` | `shadow-brand-sm` | `0px 4px 4px` (15% brand) | Subtle elevation |
| `brand` | `shadow-brand` | `0px 4px 24px` (15% brand) | Default cards, buttons |
| `brand-lg` | `shadow-brand-lg` | `0px 4px 24px` (45% brand) | Emphasized elements, modals |

### Usage Examples

```tsx
{/* Card with subtle shadow */}
<div className="bg-card rounded-lg p-6 shadow-brand-sm">
  Subtle card
</div>

{/* Elevated card */}
<div className="bg-card rounded-lg p-6 shadow-brand">
  Default elevation
</div>

{/* Modal or hero element */}
<div className="bg-card rounded-lg p-8 shadow-brand-lg">
  High emphasis
</div>

{/* Interactive shadow on hover */}
<div className="bg-card rounded-lg p-6 shadow-brand-sm hover:shadow-brand transition-shadow">
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
  className="border border-border hover:border-border-hover transition-colors"
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

1. Add light value to `:root` block in `src/styles/tokens.css`
2. Add dark value to `.theme-dark` block
3. Add Tailwind mapping in `@theme inline` block: `--color-my-token: var(--my-token);`
4. Use as Tailwind class: `bg-my-token`, `text-my-token`, `border-my-token`

### Composing a Card

```tsx
<div className="bg-card text-card-foreground rounded-lg border border-border
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
  <div className="w-2 h-2 rounded-full bg-success" />
  <span className="text-sm text-muted-foreground">All systems operational</span>
</div>
```

---

## Token File Reference

All tokens live in `src/styles/tokens.css`. Three layers:

| Layer | CSS construct | Purpose |
|-------|--------------|---------|
| 1. Brand | `@theme { }` | Raw brand values (colors, gradients, shadows, fonts) — extends Tailwind |
| 2. Semantic | `:root { }` / `.theme-dark { }` | Purpose-driven tokens that swap per theme |
| 3. Tailwind bridge | `@theme inline { }` | Maps semantic tokens to Tailwind's `--color-*` namespace |

To modify tokens, edit `src/styles/tokens.css` directly. Changes propagate to all Tailwind classes automatically.

---

## Preview App

Run `pnpm dev` and visit http://localhost:3000. Five tabs:

| Tab | Content |
|-----|---------|
| Colors | Brand swatches, semantic tokens (theme-aware), status colors, borders |
| Typography | Heading scale (Header–H7), body styles, font family specimens |
| Spacing | Tailwind spacing scale, breakpoints table, border radius samples |
| Effects | Shadow tokens, gradient swatches, transition speed demos (hover) |
| Icons | Icon size tokens (placeholder for future icon library) |

Theme switcher in the sticky header toggles light/dark.
