# Publishing to npm

Guide for publishing `@aleph-front-bkp/ds` to npm. Also serves as a template for other projects.

## Prerequisites

### One-time npm setup

1. **Create the npm org** — Go to [npmjs.com/org/create](https://www.npmjs.com/org/create) and create `@aleph-front-bkp` (free for public packages).

2. **First publish (manual)** — OIDC trusted publishing requires the package to already exist on npm. Publish v0.1.0 manually:

   ```bash
   cd packages/ds
   npm publish --access public
   ```

   npm will prompt for 2FA if enabled on your account. If you get a 403, enable 2FA at npmjs.com → Account Settings → Security, then retry.

3. **Configure trusted publisher** — On npmjs.com, go to the package → Settings → Publishing access → Add trusted publisher:

   | Field | Value |
   |-------|-------|
   | Repository owner | `cpascariello` |
   | Repository name | `aleph-cloud-ds` (**name only**, not the full URL) |
   | Workflow filename | `publish.yml` |
   | Environment | `npm-publish` (must match the `environment:` field in the workflow) |

   **Common mistake:** Entering the full URL (`https://github.com/cpascariello/aleph-cloud-ds`) instead of just `aleph-cloud-ds`. The repository name field expects only the name.

4. **Verify `repository.url` in package.json** — Must match the GitHub repo exactly:
   ```json
   "repository": {
     "type": "git",
     "url": "git+https://github.com/cpascariello/aleph-cloud-ds.git"
   }
   ```

### Repository setup

- `repository` field in `packages/ds/package.json` must match the GitHub repo
- GitHub Actions workflows at `.github/workflows/ci.yml` and `.github/workflows/publish.yml`
- GitHub environment `npm-publish` is created automatically on first workflow run

## Cutting a Release

1. **Update CHANGELOG.md** — Move items from `[Unreleased]` to a new version section:
   ```markdown
   ## [0.3.0] - 2026-03-15

   ### Added
   - New component X
   ```

2. **Bump version** in `packages/ds/package.json`. In a pnpm monorepo, `npm version` may not create a git commit or tag, so do it manually:
   ```bash
   # Edit packages/ds/package.json version field directly, or:
   cd packages/ds
   npm version patch  # or minor, or major
   ```

3. **Commit the release**:
   ```bash
   git add packages/ds/package.json packages/ds/CHANGELOG.md
   git commit -m "release: vX.Y.Z"
   ```

4. **Create and push the tag** — Push the commit and tag separately. `--follow-tags` is unreliable with lightweight tags (which `npm version` creates):
   ```bash
   git push origin main
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```

5. **Watch the publish** — The tag push triggers the publish workflow:
   ```bash
   gh run watch
   ```

6. **Verify** — Check the [Actions tab](https://github.com/cpascariello/aleph-cloud-ds/actions) on GitHub. Verify on [npmjs.com](https://www.npmjs.com/package/@aleph-front-bkp/ds) that the new version appears with a provenance badge.

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
1. Upgrade npm to latest (OIDC requires npm >= 11.5.1, Node 22 ships with npm 10.x)
2. Install deps
3. Build the DS package
4. Verify with publint + attw
5. Publish via OIDC trusted publishing (tokenless — no stored npm secrets)

### OIDC Trusted Publishing

npm's OIDC support (GA since July 2025) eliminates stored tokens entirely. GitHub Actions mints a short-lived OIDC token, npm verifies it against the trusted publisher config, and the package is published with automatic provenance attestation.

**Requirements:**
- npm CLI >= 11.5.1 (workflow runs `npm install -g npm@latest`)
- `id-token: write` permission in the workflow
- `environment: npm-publish` in the workflow job (must match npmjs.com config)
- Trusted publisher configured on npmjs.com
- `NODE_AUTH_TOKEN` must **not** be set — OIDC only activates when no auth token is present
- No `registry-url` in `actions/setup-node` — it auto-sets `NODE_AUTH_TOKEN` to `GITHUB_TOKEN`, blocking OIDC

**What the workflow must NOT have:**
```yaml
# DO NOT use registry-url — it sets NODE_AUTH_TOKEN which blocks OIDC
- uses: actions/setup-node@...
  with:
    registry-url: https://registry.npmjs.org  # ← REMOVE THIS

# DO NOT set NODE_AUTH_TOKEN — even an empty string blocks OIDC
env:
  NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}  # ← REMOVE THIS
```

### Build System

- **tsup** compiles `.tsx` source to ESM JavaScript + `.d.ts` type declarations
- **`publishConfig.exports`** swaps raw source paths for compiled `dist/` paths at publish time
- Local monorepo dev is unchanged — `exports` still points to raw `.tsx`
- CSS tokens ship as-is (no compilation)

### Security

- All GitHub Actions pinned to full SHA hashes (not mutable tags)
- Top-level `permissions: {}` in workflows (explicit per-job grants)
- `persist-credentials: false` on checkout
- OIDC trusted publishing — no stored npm tokens, no long-lived credentials
- Provenance attestation generated automatically by npm OIDC

## Troubleshooting

### OIDC: "Access token expired or revoked" / 404

**Symptom:** Publish step fails with `npm notice Access token expired or revoked` followed by a 404 error.

**Cause:** The OIDC token exchange with npm failed. npm minted the token but the trusted publisher config on npmjs.com doesn't match.

**Fix:** Verify the trusted publisher config at `npmjs.com/package/@aleph-front-bkp/ds/access`:
- **Repository name must be just the name** (e.g., `aleph-cloud-ds`), NOT the full URL
- Repository owner is case-sensitive
- Workflow filename must match exactly (e.g., `publish.yml`)
- Environment must match the `environment:` field in the workflow YAML

### OIDC: "ENEEDAUTH — need auth"

**Symptom:** `npm error need auth This command requires you to be logged in`

**Cause:** npm didn't attempt OIDC at all. Either `NODE_AUTH_TOKEN` is set (blocking OIDC), or npm version is too old.

**Fix:**
1. Check that the workflow does NOT use `registry-url` in `actions/setup-node` — it auto-sets `NODE_AUTH_TOKEN` to `GITHUB_TOKEN`
2. Check that no step sets `NODE_AUTH_TOKEN` in `env:`
3. Ensure npm >= 11.5.1 — add `npm install -g npm@latest` step before publish
4. Verify `id-token: write` permission is set on the job

**Debug:** Add a temporary step to inspect the auth state:
```yaml
- name: Debug auth state
  run: |
    npm -v
    npm config list
    if [ -z "${NODE_AUTH_TOKEN+x}" ]; then echo "NODE_AUTH_TOKEN: NOT SET"; else echo "NODE_AUTH_TOKEN: SET"; fi
```

### OIDC: "package not found" during token exchange

**Symptom:** Verbose logs show `npm http fetch POST 404 .../oidc/token/exchange/package/...` with message "OIDC token exchange error - package not found".

**Cause:** OIDC is activating correctly, but npm's token exchange rejects the request because the trusted publisher config doesn't match the OIDC claims.

**Fix:** Double-check every field in the trusted publisher config on npmjs.com. The most common mistake is entering the full GitHub URL instead of just the repository name.

### OIDC: `setup-node` silently sets `NODE_AUTH_TOKEN`

**Symptom:** You removed `NODE_AUTH_TOKEN` from the workflow, but CI logs still show `NODE_AUTH_TOKEN: XXXXX-XXXXX-XXXXX-XXXXX` in the environment.

**Cause:** `actions/setup-node` with `registry-url` set automatically exports `NODE_AUTH_TOKEN` (set to `GITHUB_TOKEN`) for all subsequent steps. This is invisible in the workflow YAML.

**Fix:** Remove `registry-url` from `actions/setup-node`. The npm OIDC flow handles registry resolution internally — it doesn't need an `.npmrc`.

### First publish: 403 "Two-factor authentication required"

**Symptom:** `npm publish --access public` returns 403 requiring 2FA.

**Cause:** npm requires 2FA or a granular access token for publishing.

**Fix:** Enable 2FA on your npm account at npmjs.com → Account Settings → Security → Enable Two-Factor Authentication. Then retry `npm publish --access public` — npm will prompt for the OTP code.

### `npm version` doesn't commit or tag in monorepo

**Symptom:** Running `npm version patch` in `packages/ds/` prints the new version but `git log` shows no new commit and `git tag -l` shows no new tag.

**Cause:** `npm version` in a pnpm workspace subdirectory may not create git commits or tags.

**Fix:** Do it manually:
```bash
# npm version still updates package.json correctly
cd packages/ds
npm version patch

# But create the commit and tag yourself
git add package.json
git commit -m "release: vX.Y.Z"
git tag vX.Y.Z
```

### `git push --follow-tags` doesn't push the tag

**Symptom:** `git push origin main --follow-tags` says "Everything up-to-date" but the tag isn't on the remote.

**Cause:** `--follow-tags` only pushes **annotated** tags. `npm version` creates **lightweight** tags.

**Fix:** Push the tag explicitly:
```bash
git push origin main
git push origin vX.Y.Z
```

### `pnpm build` fails with "tsup: command not found"

**Symptom:** First build after install fails because tsup's dependency esbuild didn't compile its native binary.

**Cause:** pnpm blocks postinstall scripts by default. esbuild needs its postinstall to compile the native binary.

**Fix:** `pnpm approve-builds` — this whitelists esbuild's build script. Then rerun `pnpm install && pnpm build`.

### publint reports missing files

The `files` field in `package.json` controls what gets packaged. Run `npm pack --dry-run` to see exactly what would be included. Update `files` if needed.

### attw reports type resolution issues

Check that every `publishConfig.exports` entry has both `types` and `import` conditions, and that the paths match actual files in `dist/`.

### attw fails with "Specifying a directory requires --pack"

**Symptom:** `attw --pack .` fails because `publishConfig.exports` overlay isn't applied to the local directory.

**Fix:** Pack the tarball first, then run attw against it:
```bash
pnpm pack --pack-destination /tmp
attw /tmp/aleph-front-bkp-ds-*.tgz --profile esm-only --exclude-entrypoints ./styles/tokens.css
rm -f /tmp/aleph-front-bkp-ds-*.tgz
```

### TypeScript TS4023 "has or is using name from external module"

**Symptom:** `tsup` declaration emit fails because TypeScript can't name a type from a dependency's internals (e.g., Radix UI's `SelectSharedProps`).

**Fix:** Replace the derived type (`ComponentPropsWithoutRef<typeof SomePrimitive.Root>`) with an explicit inline type that lists the props you actually use. This gives TypeScript full control over the declaration output.

## Template Notes

To reuse this setup in another project:

1. Copy `.github/workflows/ci.yml` and `.github/workflows/publish.yml`
2. Update `--filter` targets to match your package name
3. Add `tsup`, `publint`, `@arethetypeswrong/cli` as dev dependencies
4. Create `tsup.config.ts` with your entry points
5. Add `publishConfig.exports`, `files`, and `repository` to package.json
6. Ensure `npm install -g npm@latest` step in publish workflow (OIDC requires npm >= 11.5.1)
7. Do NOT use `registry-url` in `actions/setup-node` — it breaks OIDC
8. Do the one-time npm setup (org, first publish, trusted publisher config)
