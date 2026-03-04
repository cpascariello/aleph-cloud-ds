# npm Publish Pipeline — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Automated npm publishing for `@aleph-front/ds` via GitHub Actions with OIDC trusted publishing, tsup build, and CI verification.

**Architecture:** Two GitHub Actions workflows — `ci.yml` validates PRs (lint, typecheck, test, build, package verification), `publish.yml` publishes on `v*` tag push via OIDC. The DS package uses tsup to compile `.tsx` source to ESM JS + `.d.ts`, with `publishConfig.exports` swapping raw source for compiled output at publish time. Local monorepo dev is unchanged.

**Tech Stack:** tsup (esbuild-based bundler), publint + @arethetypeswrong/cli (package verification), GitHub Actions with OIDC trusted publishing.

**Design doc:** `docs/plans/2026-03-04-npm-publish-design.md`

---

### Task 1: Install build and verification tooling

**Files:**
- Modify: `packages/ds/package.json`

**Step 1: Install tsup, publint, and attw**

```bash
cd packages/ds && pnpm add -D tsup publint @arethetypeswrong/cli
```

**Step 2: Verify installation**

```bash
cd packages/ds && pnpm exec tsup --version && pnpm exec publint --help && pnpm exec attw --version
```

Expected: Version numbers print without errors.

**Step 3: Commit**

```bash
git add packages/ds/package.json pnpm-lock.yaml
git commit -m "build: add tsup, publint, and attw as dev dependencies"
```

---

### Task 2: Configure tsup and verify build

**Files:**
- Create: `packages/ds/tsup.config.ts`

**Step 1: Create tsup config**

The config must:
- List every TS/TSX export as an entry point (16 entries, CSS excluded — it ships as-is)
- Use `esbuildOptions.alias` to resolve the `@ac/*` path alias that components use internally
- Externalize `react`, `react-dom`, and all `dependencies` (CVA, clsx, radix-ui, tailwind-merge)
- Enable `splitting` so shared code (like `cn`) becomes a chunk, not duplicated
- Enable `dts` for TypeScript declaration generation

```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    "components/button/button": "src/components/button/button.tsx",
    "components/checkbox/checkbox":
      "src/components/checkbox/checkbox.tsx",
    "components/input/input": "src/components/input/input.tsx",
    "components/textarea/textarea":
      "src/components/textarea/textarea.tsx",
    "components/select/select": "src/components/select/select.tsx",
    "components/switch/switch": "src/components/switch/switch.tsx",
    "components/form-field/form-field":
      "src/components/form-field/form-field.tsx",
    "components/badge/badge": "src/components/badge/badge.tsx",
    "components/card/card": "src/components/card/card.tsx",
    "components/status-dot/status-dot":
      "src/components/status-dot/status-dot.tsx",
    "components/table/table": "src/components/table/table.tsx",
    "components/tooltip/tooltip":
      "src/components/tooltip/tooltip.tsx",
    "components/radio-group/radio-group":
      "src/components/radio-group/radio-group.tsx",
    "components/ui/skeleton": "src/components/ui/skeleton.tsx",
    "components/ui/spinner": "src/components/ui/spinner.tsx",
    "lib/cn": "src/lib/cn.ts",
  },
  format: ["esm"],
  dts: true,
  splitting: true,
  outDir: "dist",
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "class-variance-authority",
    "clsx",
    "radix-ui",
    "tailwind-merge",
  ],
  esbuildOptions(options) {
    options.alias = { "@ac": "./src" };
  },
});
```

**Step 2: Run the build**

```bash
cd packages/ds && pnpm exec tsup
```

Expected: `dist/` directory created with `.js` and `.d.ts` files for each entry point. No errors.

**Step 3: Verify output structure**

```bash
find packages/ds/dist -type f | head -20
```

Expected output includes files like:
```
dist/components/button/button.js
dist/components/button/button.d.ts
dist/lib/cn.js
dist/lib/cn.d.ts
```

**Step 4: Verify DTS files don't contain unresolved `@ac/` paths**

```bash
grep -r "@ac/" packages/ds/dist/ || echo "No unresolved @ac/ paths — good"
```

Expected: "No unresolved @ac/ paths — good". If `@ac/` paths are found in `.d.ts` files, the DTS generation didn't resolve the alias. Fix by switching to `dts: { resolve: true }` in tsup.config.ts (this bundles all types into each entry point, resolving all internal imports).

**Step 5: Commit**

```bash
git add packages/ds/tsup.config.ts
git commit -m "build: add tsup config with entry points for all DS exports"
```

---

### Task 3: Update package.json for publishing

**Files:**
- Modify: `packages/ds/package.json`
- Modify: `.gitignore`

**Step 1: Add `publishConfig.exports`, `files`, `repository`, and scripts to `packages/ds/package.json`**

Add these fields (merge with existing):

```jsonc
{
  "repository": {
    "type": "git",
    "url": "https://github.com/aleph-cloud/aleph-cloud-ds",
    "directory": "packages/ds"
  },
  "files": ["dist", "src/styles"],
  "publishConfig": {
    "exports": {
      "./button": {
        "types": "./dist/components/button/button.d.ts",
        "import": "./dist/components/button/button.js"
      },
      "./checkbox": {
        "types": "./dist/components/checkbox/checkbox.d.ts",
        "import": "./dist/components/checkbox/checkbox.js"
      },
      "./input": {
        "types": "./dist/components/input/input.d.ts",
        "import": "./dist/components/input/input.js"
      },
      "./textarea": {
        "types": "./dist/components/textarea/textarea.d.ts",
        "import": "./dist/components/textarea/textarea.js"
      },
      "./select": {
        "types": "./dist/components/select/select.d.ts",
        "import": "./dist/components/select/select.js"
      },
      "./switch": {
        "types": "./dist/components/switch/switch.d.ts",
        "import": "./dist/components/switch/switch.js"
      },
      "./form-field": {
        "types": "./dist/components/form-field/form-field.d.ts",
        "import": "./dist/components/form-field/form-field.js"
      },
      "./badge": {
        "types": "./dist/components/badge/badge.d.ts",
        "import": "./dist/components/badge/badge.js"
      },
      "./card": {
        "types": "./dist/components/card/card.d.ts",
        "import": "./dist/components/card/card.js"
      },
      "./status-dot": {
        "types": "./dist/components/status-dot/status-dot.d.ts",
        "import": "./dist/components/status-dot/status-dot.js"
      },
      "./table": {
        "types": "./dist/components/table/table.d.ts",
        "import": "./dist/components/table/table.js"
      },
      "./tooltip": {
        "types": "./dist/components/tooltip/tooltip.d.ts",
        "import": "./dist/components/tooltip/tooltip.js"
      },
      "./radio-group": {
        "types": "./dist/components/radio-group/radio-group.d.ts",
        "import": "./dist/components/radio-group/radio-group.js"
      },
      "./ui/skeleton": {
        "types": "./dist/components/ui/skeleton.d.ts",
        "import": "./dist/components/ui/skeleton.js"
      },
      "./ui/spinner": {
        "types": "./dist/components/ui/spinner.d.ts",
        "import": "./dist/components/ui/spinner.js"
      },
      "./lib/cn": {
        "types": "./dist/lib/cn.d.ts",
        "import": "./dist/lib/cn.js"
      },
      "./styles/tokens.css": "./src/styles/tokens.css"
    }
  }
}
```

Add to `scripts` (merge with existing):

```json
{
  "scripts": {
    "build": "tsup",
    "check:package": "publint && attw --pack ."
  }
}
```

**Note:** Confirm the actual GitHub repo URL with the user before committing. The `repository` field must match exactly for OIDC trusted publishing.

**Step 2: Add `dist/` to root `.gitignore`**

Append `dist/` to `.gitignore`.

**Step 3: Run build + verify**

```bash
cd packages/ds && pnpm build && pnpm check:package
```

Expected: tsup builds successfully, publint reports no errors, attw reports no type resolution issues.

If publint or attw report issues, fix them before proceeding. Common issues:
- Missing `types` condition in an export → add it
- `files` doesn't include a referenced path → update `files`
- DTS file has wrong module type → check tsup `format` setting

**Step 4: Verify `npm pack` contents**

```bash
cd packages/ds && npm pack --dry-run 2>&1 | head -40
```

Expected: Lists `dist/` files and `src/styles/tokens.css`. Should NOT include test files, tsconfig, vitest config, or source `.tsx` files (except tokens.css).

**Step 5: Commit**

```bash
git add packages/ds/package.json .gitignore
git commit -m "build: configure package.json for npm publishing with publishConfig exports"
```

---

### Task 4: Create CI workflow

**Files:**
- Create: `.github/workflows/ci.yml`

**Step 1: Look up latest action SHA hashes**

```bash
gh api repos/actions/checkout/git/ref/tags/v4 --jq '.object.sha'
gh api repos/actions/setup-node/git/ref/tags/v4 --jq '.object.sha'
gh api repos/pnpm/action-setup/git/ref/tags/v4 --jq '.object.sha'
```

Note the full SHAs for pinning. If the tag is annotated (object.type == "tag"), dereference:
```bash
gh api repos/actions/checkout/git/tags/<sha> --jq '.object.sha'
```

**Step 2: Create `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

permissions:
  contents: read

jobs:
  check:
    name: Lint, typecheck, test, build
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@<SHA>  # v4
        with:
          persist-credentials: false

      - uses: pnpm/action-setup@<SHA>  # v4

      - uses: actions/setup-node@<SHA>  # v4
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test

      - name: Build DS package
        run: pnpm --filter @aleph-front/ds build

      - name: Verify package
        working-directory: packages/ds
        run: pnpm check:package
```

Replace `<SHA>` placeholders with the actual SHAs from Step 1.

**Step 3: Validate with actionlint**

```bash
actionlint .github/workflows/ci.yml
```

Expected: No errors.

**Step 4: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add PR validation workflow (lint, typecheck, test, build, package verify)"
```

---

### Task 5: Create publish workflow

**Files:**
- Create: `.github/workflows/publish.yml`

**Step 1: Create `.github/workflows/publish.yml`**

```yaml
name: Publish

on:
  push:
    tags:
      - "v*"

permissions: {}

jobs:
  publish:
    name: Publish to npm
    runs-on: ubuntu-latest

    permissions:
      id-token: write
      contents: read

    steps:
      - uses: actions/checkout@<SHA>  # v4
        with:
          persist-credentials: false

      - uses: pnpm/action-setup@<SHA>  # v4

      - uses: actions/setup-node@<SHA>  # v4
        with:
          node-version: 22
          cache: pnpm
          registry-url: https://registry.npmjs.org

      - run: pnpm install --frozen-lockfile

      - name: Build DS package
        run: pnpm --filter @aleph-front/ds build

      - name: Verify package
        working-directory: packages/ds
        run: pnpm check:package

      - name: Publish to npm
        run: pnpm --filter @aleph-front/ds publish --no-git-checks
        env:
          NPM_CONFIG_PROVENANCE: "true"
```

Use the same SHA hashes from Task 4.

**Key details:**
- `permissions: {}` at top level grants nothing by default
- `id-token: write` enables OIDC token for npm trusted publishing
- `registry-url` is required for `setup-node` to configure npm auth
- `--no-git-checks` bypasses pnpm's branch/clean-tree check (CI runs on detached HEAD from tag)
- `NPM_CONFIG_PROVENANCE` ensures provenance attestation is generated
- No `NPM_TOKEN` or `NODE_AUTH_TOKEN` — OIDC handles auth entirely

**Step 2: Validate with actionlint**

```bash
actionlint .github/workflows/publish.yml
```

Expected: No errors.

**Step 3: Commit**

```bash
git add .github/workflows/publish.yml
git commit -m "ci: add npm publish workflow with OIDC trusted publishing"
```

---

### Task 6: Create CHANGELOG

**Files:**
- Create: `packages/ds/CHANGELOG.md`

**Step 1: Create initial CHANGELOG**

```markdown
# Changelog

All notable changes to `@aleph-front/ds` will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Button component with 6 variants (primary, secondary, outline, text, destructive, warning), 4 sizes, loading state, icon slots, asChild polymorphism
- Input component with 2 sizes, shadow-brand style, error/disabled states
- Textarea component with shadow-brand style, vertical resize, error/disabled states
- Checkbox component (Radix UI) with 3 sizes, clip-path animation, error/disabled states
- RadioGroup component (Radix UI) with 3 sizes, clip-path animation, group/item disabled
- Switch component (Radix UI) with 3 sizes, animated sliding thumb, disabled state
- Select component (Radix UI) with flat options prop, 2 sizes, shadow-brand style, portal dropdown
- FormField wrapper with label, required asterisk, helper text, error message, auto-wired accessibility
- Badge component with 5 semantic variants, 2 sizes
- StatusDot component with 5 health variants, pulse animation, 2 sizes
- Card component with 3 variants (default/noise/ghost), 3 padding sizes, optional title
- Table component with generic typing, sortable columns, keyboard-accessible sorting, row highlight
- Tooltip component (Radix UI) with composable API, dark mode contrast fix
- Skeleton loading placeholder with consumer-driven sizing
- Spinner component for loading states
- cn() utility (clsx + tailwind-merge)
- Three-layer OKLCH token system with light/dark themes
- `destructive` color alias for shadcn/Tailwind compatibility
```

**Step 2: Commit**

```bash
git add packages/ds/CHANGELOG.md
git commit -m "docs: add initial CHANGELOG for @aleph-front/ds"
```

---

### Task 7: Write npm publish guide

**Files:**
- Create: `docs/guides/npm-publish.md`

**Step 1: Create the guide**

```markdown
# Publishing to npm

Guide for publishing `@aleph-front/ds` to npm. Also serves as a template for other projects.

## Prerequisites

### One-time npm setup

1. **Create the npm org** — Go to [npmjs.com/org/create](https://www.npmjs.com/org/create) and create `@aleph-front` (free for public packages).

2. **First publish (manual)** — OIDC trusted publishing requires the package to already exist on npm. Publish v0.1.0 manually:

   ```bash
   # Generate a granular access token at npmjs.com → Access Tokens → Generate New Token → Granular
   # Scope: @aleph-front, read-write, 7-day expiry
   cd packages/ds
   npm publish --access public
   ```

3. **Configure trusted publisher** — On npmjs.com, go to the package → Settings → Trusted Publishers → Add:
   - Repository: `<org>/<repo>` (must match `repository.url` in package.json)
   - Workflow: `publish.yml`
   - Environment: (leave blank unless using GitHub environments)

4. **Delete the access token** — It's no longer needed. All future publishes use OIDC.

### Repository setup

- `repository` field in `packages/ds/package.json` must match the GitHub repo exactly
- GitHub Actions workflows exist at `.github/workflows/ci.yml` and `.github/workflows/publish.yml`

## Cutting a Release

1. **Update version** in `packages/ds/package.json`:
   ```bash
   cd packages/ds
   # Choose the appropriate bump: patch (0.1.1), minor (0.2.0), or major (1.0.0)
   npm version patch  # or minor, or major
   ```
   This updates `package.json` and creates a git tag.

2. **Update CHANGELOG.md** — Move items from `[Unreleased]` to a new version section:
   ```markdown
   ## [0.2.0] - 2026-03-15

   ### Added
   - New component X
   ```

3. **Commit the release**:
   ```bash
   git add packages/ds/package.json packages/ds/CHANGELOG.md
   git commit -m "release: v0.2.0"
   git tag v0.2.0  # if npm version didn't already create it
   ```

4. **Push with tags**:
   ```bash
   git push origin main --tags
   ```

5. **Verify** — Check the Actions tab on GitHub. The publish workflow should run and succeed. Verify on npmjs.com that the new version appears with a provenance badge.

## How It Works

### CI Workflow (`ci.yml`)

Runs on PRs and pushes to `main`. Steps:
1. Install deps with `pnpm install --frozen-lockfile`
2. Lint (`pnpm lint`)
3. Typecheck (`pnpm typecheck`)
4. Test (`pnpm test`)
5. Build the DS package (`pnpm --filter @aleph-front/ds build`)
6. Verify package exports (`publint` + `attw`)

### Publish Workflow (`publish.yml`)

Runs when a `v*` tag is pushed. Steps:
1. Build the DS package
2. Verify with publint + attw
3. Publish via OIDC trusted publishing (no stored tokens)

### Build System

- **tsup** compiles `.tsx` source to ESM JavaScript + `.d.ts` type declarations
- **`publishConfig.exports`** swaps raw source paths for compiled `dist/` paths at publish time
- Local monorepo dev is unchanged — `exports` still points to raw `.tsx`
- CSS tokens ship as-is (no compilation)

### Security

- All GitHub Actions pinned to full SHA hashes
- Top-level `permissions: {}` in workflows (explicit per-job grants)
- `persist-credentials: false` on checkout
- OIDC trusted publishing — no stored npm tokens
- Provenance attestation generated automatically

## Troubleshooting

### publint reports missing files

The `files` field in `package.json` controls what gets packaged. Run `npm pack --dry-run` to see exactly what would be included. Update `files` if needed.

### attw reports type resolution issues

Check that every `publishConfig.exports` entry has both `types` and `import` conditions, and that the paths match actual files in `dist/`.

### Publish fails with 403

OIDC trusted publisher may not be configured, or the `repository` field doesn't match the GitHub repo. Check npmjs.com package settings.

### Publish fails with "not on a branch"

This is expected in CI — the tag checkout creates a detached HEAD. The `--no-git-checks` flag handles this. If it's still failing, check that the flag is present in the workflow.

## Template Notes

To reuse this setup in another project:

1. Copy `.github/workflows/ci.yml` and `.github/workflows/publish.yml`
2. Update `--filter` targets to match your package name
3. Add `tsup`, `publint`, `@arethetypeswrong/cli` as dev dependencies
4. Create `tsup.config.ts` with your entry points
5. Add `publishConfig.exports`, `files`, and `repository` to package.json
6. Do the one-time npm setup (org, first publish, trusted publisher)
```

**Step 2: Commit**

```bash
git add docs/guides/npm-publish.md
git commit -m "docs: add npm publish guide with template notes"
```

---

### Task 8: Update project docs

- [ ] DESIGN-SYSTEM.md — no changes needed (no new tokens/components)
- [ ] ARCHITECTURE.md — add build system section, update "Source exports" to explain hybrid approach
- [ ] DECISIONS.md — log the npm publish design decisions
- [ ] BACKLOG.md — add any deferred ideas (e.g., Changesets migration)
- [ ] CLAUDE.md — update Current Features list and Commands section

**Step 1: Update ARCHITECTURE.md**

Add a new section after "Source exports (no build step)":

```markdown
### Build & Publish

The DS package uses tsup to compile `.tsx` source into ESM JavaScript + `.d.ts` type declarations for npm publishing. The `publishConfig.exports` field in `package.json` swaps raw source paths for compiled `dist/` paths at publish time — local monorepo dev still uses raw `.tsx` imports with zero build latency.

**Build command:** `pnpm --filter @aleph-front/ds build` (runs tsup)

**Package verification:** `publint` validates export map integrity, `@arethetypeswrong/cli` validates TypeScript declaration resolution. Both run in CI before publish.

**Key files:** `packages/ds/tsup.config.ts`, `.github/workflows/ci.yml`, `.github/workflows/publish.yml`
```

Update the existing "Source exports (no build step)" heading to:

```markdown
### Source exports (local dev)

The DS package exports raw `.tsx` source files via `"exports"` in `package.json` for local monorepo dev. Consumer apps compile it themselves via their bundler (add `transpilePackages: ["@aleph-front/ds"]` to Next.js config). For npm consumers, `publishConfig.exports` overrides these paths with compiled `dist/` output — see "Build & Publish" below.
```

Update the project structure tree to include:
```
│       ├── tsup.config.ts
│       ├── CHANGELOG.md
```

And at the top level:
```
├── .github/
│   └── workflows/
│       ├── ci.yml              # PR validation (lint, typecheck, test, build, verify)
│       └── publish.yml         # npm publish on v* tag (OIDC trusted publishing)
```

**Step 2: Update DECISIONS.md**

Add a new decision entry:

```markdown
## Decision #45 — 2026-03-04

**Context:** Setting up npm publishing for `@aleph-front/ds`. Needed to choose versioning trigger, build tool, export strategy, and authentication method.
**Decision:** Tag-triggered GitHub Actions publish (`v*` tags) with OIDC trusted publishing (no stored npm tokens). tsup builds ESM + DTS. Hybrid `publishConfig.exports` keeps raw `.tsx` for local dev while shipping compiled output to npm. Two workflows: `ci.yml` (PR validation) and `publish.yml` (tag-triggered publish).
**Rationale:** Tag trigger is simpler than Changesets for a small team — direct control without automation overhead. OIDC is the only forward-looking auth path (npm revoked classic tokens Dec 2025). tsup over tsdown for maturity. Hybrid exports preserve the zero-build DX that makes monorepo dev fast.
**Alternatives considered:** Changesets (automation overhead not justified yet — can migrate later), manual workflow_dispatch (too easy to forget), shipping raw `.tsx` to npm (requires consumers to have TypeScript + compatible bundler, non-standard).
```

**Step 3: Update BACKLOG.md**

Add under deferred ideas:

```markdown
### 2026-03-04 — Changesets migration
**Source:** Identified during npm publish pipeline design
**Description:** Migrate from manual version bumps + git tags to @changesets/cli for automated version management and changelog generation. Would add a "Version Packages" PR bot.
**Priority:** Low (current tag-based workflow is sufficient for small team)
```

**Step 4: Update CLAUDE.md**

In the "Commands" section, add:

```bash
pnpm --filter @aleph-front/ds build    # tsup build — DS package only
pnpm --filter @aleph-front/ds check:package  # publint + attw verification
```

In the "Current Features" section, add:

```
- tsup build pipeline with hybrid publishConfig exports (raw .tsx locally, compiled dist/ on npm)
- GitHub Actions CI (lint, typecheck, test, build, package verify on PRs)
- GitHub Actions publish (OIDC trusted publishing on v* tag push, provenance attestation)
- publint + @arethetypeswrong/cli package verification
```

**Step 5: Commit**

```bash
git add docs/ARCHITECTURE.md docs/DECISIONS.md docs/BACKLOG.md CLAUDE.md
git commit -m "docs: update project docs for npm publish pipeline"
```

---

### Task 9: Final verification

**Step 1: Run full check suite**

```bash
pnpm check
```

Expected: lint, typecheck, and tests all pass.

**Step 2: Run build + package verify**

```bash
pnpm --filter @aleph-front/ds build && cd packages/ds && pnpm check:package
```

Expected: Build succeeds, publint and attw report no issues.

**Step 3: Verify npm pack contents**

```bash
cd packages/ds && npm pack --dry-run
```

Expected: Only `dist/`, `src/styles/`, `package.json`, `CHANGELOG.md`, `README.md` (if exists), and `LICENSE` (if exists).

**Step 4: Validate both workflows**

```bash
actionlint .github/workflows/ci.yml .github/workflows/publish.yml
```

Expected: No errors.

**Step 5: Verify preview app still works**

```bash
pnpm dev
```

Expected: Preview app starts and components render correctly. The raw `.tsx` exports still work for local dev.
