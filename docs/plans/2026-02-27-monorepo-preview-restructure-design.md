# Monorepo + Preview Restructure Design

**Date:** 2026-02-27
**Status:** Approved

---

## Goal

Restructure the Aleph Cloud DS repo into a pnpm monorepo with two workspaces:
1. `packages/ds` — the publishable design system (`@aleph-front/ds`)
2. `apps/preview` — the Next.js preview/documentation app

Replace the flat tab navigation with a sidebar + route-per-page architecture that scales as components are added.

---

## Monorepo Structure

```
aleph-cloud-ds/
├── pnpm-workspace.yaml
├── package.json                      ← root scripts
├── tsconfig.base.json                ← shared compiler options
├── docs/                             ← project-level docs (unchanged)
├── CLAUDE.md
│
├── packages/
│   └── ds/                           ← @aleph-front/ds
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
│       ├── package.json
│       ├── tsconfig.json
│       └── vitest.config.ts
│
└── apps/
    └── preview/                      ← Next.js preview app
        ├── src/
        │   ├── app/
        │   │   ├── layout.tsx        ← shell: sidebar + content + theme switcher
        │   │   ├── page.tsx          ← overview landing
        │   │   ├── globals.css
        │   │   ├── foundations/
        │   │   │   ├── colors/page.tsx
        │   │   │   ├── typography/page.tsx
        │   │   │   ├── spacing/page.tsx
        │   │   │   ├── effects/page.tsx
        │   │   │   └── icons/page.tsx
        │   │   └── components/
        │   │       ├── button/page.tsx
        │   │       ├── input/page.tsx
        │   │       ├── textarea/page.tsx
        │   │       └── form-field/page.tsx
        │   └── components/
        │       ├── sidebar.tsx
        │       ├── page-header.tsx
        │       ├── demo-section.tsx
        │       └── theme-switcher.tsx
        ├── package.json
        ├── tsconfig.json
        ├── next.config.ts
        └── postcss.config.mjs
```

---

## DS Package (`packages/ds`)

### Exports map (subpath exports, source files)

```json
{
  "name": "@aleph-front/ds",
  "version": "0.0.0",
  "type": "module",
  "exports": {
    "./button": "./src/components/button/button.tsx",
    "./input": "./src/components/input/input.tsx",
    "./textarea": "./src/components/textarea/textarea.tsx",
    "./form-field": "./src/components/form-field/form-field.tsx",
    "./ui/spinner": "./src/components/ui/spinner.tsx",
    "./lib/cn": "./src/lib/cn.ts",
    "./styles/tokens.css": "./src/styles/tokens.css"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "dependencies": {
    "class-variance-authority": "0.7.1",
    "clsx": "2.1.1",
    "tailwind-merge": "3.5.0"
  }
}
```

No build step. Consumers (Next.js/Vite apps) import source TSX directly and bundle it themselves.

### Consumer import API

```tsx
import { Button } from '@aleph-front/ds/button'
import { Input } from '@aleph-front/ds/input'
import { cn } from '@aleph-front/ds/lib/cn'
import '@aleph-front/ds/styles/tokens.css'
```

### Internal alias

DS package keeps `@ac/*` → `./src/*` for internal imports between its own files.

---

## Preview App (`apps/preview`)

### Dependencies

```json
{
  "name": "@aleph-front/preview",
  "private": true,
  "dependencies": {
    "@aleph-front/ds": "workspace:*",
    "next": "16.1.6",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  }
}
```

### Page shell layout

```
┌─────────────────────────────────────────────────────┐
│  Aleph Cloud DS                        [Light/Dark] │
├────────────┬────────────────────────────────────────┤
│            │                                        │
│  SIDEBAR   │  CONTENT                               │
│  240px     │  max-w-4xl, scrollable                 │
│  fixed     │                                        │
│            │  Page Title                             │
│  Overview  │  Description                            │
│            │                                        │
│  FOUNDA-   │  ┌─ Section ─────────────────────┐     │
│  TIONS     │  │  heading + demo content       │     │
│  Colors    │  └───────────────────────────────┘     │
│  Typo...   │                                        │
│  Spacing   │  ┌─ Section ─────────────────────┐     │
│  Effects   │  │  heading + demo content       │     │
│  Icons     │  └───────────────────────────────┘     │
│            │                                        │
│  COMPO-    │                                        │
│  NENTS     │                                        │
│  Button    │                                        │
│  Input     │                                        │
│  Textarea  │                                        │
│  FormField │                                        │
│            │                                        │
└────────────┴────────────────────────────────────────┘
```

### Routes

| URL | Content |
|-----|---------|
| `/` | Overview landing — token summary cards, component list |
| `/foundations/colors` | OKLCH scales, semantic tokens, border tokens |
| `/foundations/typography` | Heading scale, body styles, font specimens |
| `/foundations/spacing` | Spacing scale, breakpoints, border radius |
| `/foundations/effects` | Shadows, gradients, transitions |
| `/foundations/icons` | Icon size tokens |
| `/components/button` | Button variants, sizes, icons, loading, disabled, asChild |
| `/components/input` | Input sizes and states |
| `/components/textarea` | Textarea demos |
| `/components/form-field` | FormField with label, helper, error |

### Sidebar navigation config

Single data structure drives rendering:

```tsx
const NAV = [
  { label: "Overview", href: "/" },
  {
    section: "Foundations",
    items: [
      { label: "Colors", href: "/foundations/colors" },
      { label: "Typography", href: "/foundations/typography" },
      { label: "Spacing", href: "/foundations/spacing" },
      { label: "Effects", href: "/foundations/effects" },
      { label: "Icons", href: "/foundations/icons" },
    ],
  },
  {
    section: "Components",
    items: [
      { label: "Button", href: "/components/button" },
      { label: "Input", href: "/components/input" },
      { label: "Textarea", href: "/components/textarea" },
      { label: "FormField", href: "/components/form-field" },
    ],
  },
];
```

### Preview-only components

| Component | Purpose |
|-----------|---------|
| `sidebar.tsx` | Navigation with sections, active route highlighting |
| `page-header.tsx` | Title + description pattern for every page |
| `demo-section.tsx` | H3 + content wrapper for demo groups |
| `theme-switcher.tsx` | Light/dark toggle (moved from DS) |

### Static export

`output: "export"` in `next.config.ts`. All routes generate static HTML.

---

## Shared Config

### `tsconfig.base.json` (root)

Shared strict compiler options. Each workspace extends it:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "noEmit": true,
    "esModuleInterop": true,
    "resolveJsonModule": true
  }
}
```

### `pnpm-workspace.yaml`

```yaml
packages:
  - "packages/*"
  - "apps/*"
```

### Root `package.json` scripts

```json
{
  "scripts": {
    "dev": "pnpm --filter @aleph-front/preview dev",
    "build": "pnpm --filter @aleph-front/preview build",
    "test": "pnpm --filter @aleph-front/ds test",
    "lint": "pnpm -r lint",
    "typecheck": "pnpm -r typecheck",
    "check": "pnpm -r check"
  }
}
```

---

## Migration: What Moves Where

| Current location | Destination |
|---|---|
| `src/components/button/` | `packages/ds/src/components/button/` |
| `src/components/input/` | `packages/ds/src/components/input/` |
| `src/components/textarea/` | `packages/ds/src/components/textarea/` |
| `src/components/form-field/` | `packages/ds/src/components/form-field/` |
| `src/components/ui/` | `packages/ds/src/components/ui/` |
| `src/styles/tokens.css` | `packages/ds/src/styles/tokens.css` |
| `src/lib/cn.ts` | `packages/ds/src/lib/cn.ts` |
| `src/app/layout.tsx` | Rewritten in `apps/preview/src/app/layout.tsx` |
| `src/app/page.tsx` | Rewritten as overview in `apps/preview/src/app/page.tsx` |
| `src/app/globals.css` | `apps/preview/src/app/globals.css` |
| `src/components/theme-switcher.tsx` | `apps/preview/src/components/theme-switcher.tsx` |
| `src/components/preview-tabs.tsx` | **Deleted** — replaced by sidebar |
| `src/components/tabs/colors-tab.tsx` | `apps/preview/src/app/foundations/colors/page.tsx` |
| `src/components/tabs/typography-tab.tsx` | `apps/preview/src/app/foundations/typography/page.tsx` |
| `src/components/tabs/spacing-tab.tsx` | `apps/preview/src/app/foundations/spacing/page.tsx` |
| `src/components/tabs/effects-tab.tsx` | `apps/preview/src/app/foundations/effects/page.tsx` |
| `src/components/tabs/icons-tab.tsx` | `apps/preview/src/app/foundations/icons/page.tsx` |
| `src/components/tabs/components-tab.tsx` | Split into per-component pages under `apps/preview/src/app/components/` |

### Config files

| Current | Destination |
|---|---|
| `package.json` | Split into root + `packages/ds/` + `apps/preview/` |
| `tsconfig.json` | Split into `tsconfig.base.json` (root) + per-workspace |
| `next.config.ts` | `apps/preview/next.config.ts` |
| `postcss.config.mjs` | `apps/preview/postcss.config.mjs` |
| `vitest.config.ts` | `packages/ds/vitest.config.ts` |

---

## Decisions Captured

- **Monorepo over separate repos:** One repo, one CI, workspace linking eliminates publish cycle friction. Separate repos only justified at dedicated-team scale.
- **Source exports over compiled dist:** All consumers are bundler-based (Next.js). Source imports mean zero build step, instant feedback. tsup can be added later if npm publishing is needed.
- **Deep imports over barrel:** `@aleph-front/ds/button` not `@aleph-front/ds`. Explicit, tree-shakeable, no barrel maintenance.
- **Sidebar + route-per-page over tabs:** Scales linearly, supports deep-linking, leverages App Router instead of fighting it.
- **Theme switcher lives in preview, not DS:** It's documentation UI, not a library component. Consumers implement their own theme toggle.
