# Publishing to npm

Guide for publishing `@aleph-front-bkp/ds` to npm. Also serves as a template for other projects.

## Prerequisites

### One-time npm setup

1. **Create the npm org** — Go to [npmjs.com/org/create](https://www.npmjs.com/org/create) and create `@aleph-front-bkp` (free for public packages).

2. **First publish (manual)** — OIDC trusted publishing requires the package to already exist on npm. Publish v0.1.0 manually:

   ```bash
   # Generate a granular access token at npmjs.com → Access Tokens → Generate New Token → Granular
   # Scope: @aleph-front-bkp, read-write, 7-day expiry
   cd packages/ds
   npm publish --access public
   ```

3. **Configure trusted publisher** — On npmjs.com, go to the package → Settings → Trusted Publishers → Add:
   - Repository: `cpascariello/aleph-cloud-ds` (must match `repository.url` in package.json)
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
5. Build the DS package (`pnpm --filter @aleph-front-bkp/ds build`)
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
