# npm Publish Pipeline — Design

## Summary

Automated npm publishing for `@aleph-front/ds` via GitHub Actions. Tag-triggered publish with OIDC trusted publishing (no stored tokens), tsup build producing JS + DTS, and a CI workflow for PR validation.

## Decisions

- **Consumers:** Next.js / Vite apps (modern bundler-based)
- **Versioning trigger:** Git tag push (`v*`), manual version bumps
- **Build tool:** tsup (ESM-only, esbuild-based)
- **Exports strategy:** Hybrid `publishConfig` override — raw `.tsx` locally, compiled `dist/` on npm
- **CI scope:** Two workflows (ci.yml for PRs + publish.yml for tags)
- **Auth:** OIDC trusted publishing (no NPM_TOKEN secret after first publish)

## Architecture

### Package Build (tsup)

tsup compiles each subpath export into `dist/`:

- **Entry points:** One per component/utility (mirrors `exports` map)
- **Format:** ESM only (`format: ['esm']`)
- **DTS:** Generated alongside each `.js` file
- **External:** `react`, `react-dom`, all `dependencies` (peer/runtime, not bundled)
- **CSS:** `tokens.css` ships as-is via `files`, not processed by tsup

### Hybrid Exports (`publishConfig`)

```json
{
  "exports": {
    "./button": "./src/components/button/button.tsx"
  },
  "publishConfig": {
    "exports": {
      "./button": {
        "types": "./dist/components/button/button.d.ts",
        "import": "./dist/components/button/button.js"
      },
      "./styles/tokens.css": "./src/styles/tokens.css"
    }
  },
  "files": ["dist", "src/styles"]
}
```

Local dev: `exports` points to raw `.tsx` (zero build latency).
Published package: `publishConfig.exports` overrides with `dist/` paths.

### CI Workflow (`.github/workflows/ci.yml`)

**Triggers:** PRs and pushes to `main`.

Steps:
1. Checkout + setup pnpm + Node 22
2. Install deps
3. Lint (`pnpm lint`)
4. Typecheck (`pnpm typecheck`)
5. Test (`pnpm test`)
6. Build DS (`pnpm --filter @aleph-front/ds build`)
7. Verify package (`publint` + `attw --pack .`)

Single job, no matrix. Permissions: `contents: read`.

### Publish Workflow (`.github/workflows/publish.yml`)

**Trigger:** Tag push matching `v*`.

Steps:
1. Checkout (`persist-credentials: false`)
2. Setup pnpm + Node 22 (`registry-url: https://registry.npmjs.org`)
3. Install deps
4. Build DS
5. Publish (`pnpm --filter @aleph-front/ds publish --no-git-checks`)

Permissions:
```yaml
permissions: {}  # top-level default

jobs:
  publish:
    permissions:
      id-token: write   # OIDC for npm trusted publishing
      contents: read     # checkout
```

No `NPM_TOKEN` secret. OIDC handles auth. Provenance is automatic.

`--no-git-checks` needed because pnpm verifies branch/clean state, which fails on detached HEAD from tag checkout.

### Security

- All actions pinned to full SHA with version comment
- Top-level `permissions: {}`, scoped per-job
- `persist-credentials: false` on checkout
- No stored npm tokens after first publish
- `publint` + `attw` verify package integrity in CI

### Package Verification (devDependencies)

- `publint` — validates `exports`, `main`, `types` against packaged files
- `@arethetypeswrong/cli` — validates TypeScript declaration resolution

### Release Process

1. Bump version in `packages/ds/package.json`
2. Update `CHANGELOG.md`
3. Commit: `release: vX.Y.Z`
4. Tag: `git tag vX.Y.Z`
5. Push: `git push origin main --tags`
6. Publish workflow fires automatically

### First Publish (one-time bootstrap)

OIDC trusted publishing requires the package to exist on npm first:

1. Create `@aleph-front` org on npmjs.com
2. Generate granular access token (90-day max)
3. Run `npm publish --access public` from `packages/ds/` manually
4. Configure trusted publisher on npmjs.com (repo + workflow + environment)
5. Delete the granular token

## Documentation Deliverable

`docs/guides/npm-publish.md` covering:
- Prerequisites (npm org, trusted publisher)
- How to cut a release
- How CI and publish workflows work
- Troubleshooting
- Template notes for reuse in other projects
