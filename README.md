# Aleph Cloud Design System

Tokens-first design system for [Aleph Cloud](https://aleph.im), built with Tailwind CSS 4, OKLCH color scales, and CSS custom properties. Ships as a component library (`@aleph-front-bkp/ds`) with a Next.js preview app for visual reference.

**Status:** Pre-release (`0.0.0`). Not yet published to npm.

## Prerequisites

- [Node.js](https://nodejs.org/) 22 LTS
- [pnpm](https://pnpm.io/) 10 — install with `corepack enable && corepack prepare pnpm@latest --activate`

## Quick Start

```bash
pnpm install
pnpm dev          # http://localhost:3000 — preview app with theme switcher
pnpm check        # lint + typecheck + test
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server (Turbopack) |
| `pnpm build` | Static export of the preview app |
| `pnpm test` | Run tests (Vitest) |
| `pnpm lint` | Lint all workspaces (oxlint) |
| `pnpm typecheck` | Type-check all workspaces |
| `pnpm check` | lint + typecheck + test |

## Project Structure

```
packages/ds/          # @aleph-front-bkp/ds — tokens + components
apps/preview/         # @aleph-front-bkp/preview — Next.js preview app
docs/                 # Architecture, decisions, design system docs
```

## Importing the DS

The design system uses source-level subpath exports:

```tsx
import { Button } from "@aleph-front-bkp/ds/button";
import { Spinner } from "@aleph-front-bkp/ds/ui/spinner";
import { cn } from "@aleph-front-bkp/ds/lib/cn";
import "@aleph-front-bkp/ds/styles/tokens.css";
```

Within each workspace, internal imports use the `@ac/*` alias which resolves to `./src/*`.

## Using with Another Local Project

The DS exports raw TypeScript/TSX source (no build step), so the consuming project's bundler must transpile it.

### 1. Link the package

From the DS repo, register the package globally:

```bash
cd packages/ds
pnpm link --global
```

From your other project, link it:

```bash
pnpm link --global @aleph-front-bkp/ds
```

### 2. Configure your bundler

Since `@aleph-front-bkp/ds` ships source files, your bundler needs to transpile it.

**Next.js** — add to `next.config.ts`:

```ts
const nextConfig = {
  transpilePackages: ["@aleph-front-bkp/ds"],
};
```

**Vite** — add to `vite.config.ts`:

```ts
export default defineConfig({
  ssr: { noExternal: ["@aleph-front-bkp/ds"] },
});
```

### 3. Include the tokens CSS

Import the design tokens in your app's global CSS or layout:

```css
@import "@aleph-front-bkp/ds/styles/tokens.css";
```

Or in a layout file:

```tsx
import "@aleph-front-bkp/ds/styles/tokens.css";
```

### 4. Tailwind CSS

If your project uses Tailwind, add the DS source to your content paths so Tailwind scans its classes:

```css
@import "tailwindcss";
@source "../../node_modules/@aleph-front-bkp/ds/src/**/*.tsx";
```

## Documentation

| You need to... | Go here |
|----------------|---------|
| Use tokens (colors, fonts, shadows, gradients, transitions) | [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) |
| Use or build components | [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) § Components |
| Understand token architecture and patterns | [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) |
| Know why a decision was made | [`docs/DECISIONS.md`](docs/DECISIONS.md) |
| See planned or deferred work | [`docs/BACKLOG.md`](docs/BACKLOG.md) |

## License

MIT — see [LICENSE](LICENSE)
