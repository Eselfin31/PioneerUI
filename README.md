# Pioneer UI

Pioneer UI is a public React + Tailwind UI system for developers who want
shadcn-style source ownership with more production-ready SaaS blocks and safer
setup/update tooling.

The launch track is:

- React + TypeScript + Tailwind.
- GitHub-hosted custom registry format.
- `pioneer` CLI with init, add, diff, update, doctor, and registry build flows.
- CSS-variable-first tokens with Tailwind v4 CSS-first support.
- Vite and Next.js examples.
- Apache-2.0 licensing.

## Local Commands

```bash
npx pnpm@11.8.0 install
npx pnpm@11.8.0 typecheck
npx pnpm@11.8.0 test
npx pnpm@11.8.0 build
```

## Registry

Registry items live under `registry/default/items`. Source templates live under
`registry/default`. The CLI can read the registry directory directly, and
`pioneer registry build` prints the generated public index for publishing.

Generate the docs-hosted registry artifact after the CLI package is built:

```bash
npx pnpm@11.8.0 registry:generate
```

Once hosted, consumers can install from the generated HTTP index:

```bash
pioneer add dashboard-shell --registry https://Eselfin31.github.io/PioneerUI/registry/index.json --write
```

For the normal project workflow, initialize once with the hosted registry URL.
The CLI stores that URL in `pioneer.json`, and later `add`, `diff`, and
`update` commands use it automatically unless `--registry` is passed again:

```bash
npx pioneer-ui@latest init --write --registry https://Eselfin31.github.io/PioneerUI/registry/index.json
npx pioneer-ui@latest add dashboard-shell settings-page --write
npx pioneer-ui@latest diff dashboard-shell
```

## Docs Deployment

The Pages workflow builds the full workspace, generates
`apps/docs/public/registry/index.json`, copies registry source templates into
the docs public directory, and deploys `apps/docs/dist` to GitHub Pages.

Set the repository Pages source to **GitHub Actions** before the first public
deploy. The workflow uses GitHub's Pages metadata to set the Vite base path, so
project Pages URLs such as `https://OWNER.github.io/REPO/` work without a
manual config edit.

For a local project-path build, set the same base variable:

```bash
PIONEER_DOCS_BASE=/PioneerUI/ npx pnpm@11.8.0 --filter @pioneer-ui/docs build
```

## Release Publishing

The release workflow publishes packages from `.github/workflows/release.yml`.
Before cutting a release, verify package contents and publish order with:

```bash
npx pnpm@11.8.0 release:dry-run
```

While package names are still unpublished, pnpm may print
`No versions available` during the dry run. Treat the process exit code and the
package list as the gate.

For the first publish of a new npm package name, use an authenticated npm
account with ownership of the target scope/name. The scoped packages publish as
public packages through their manifest `publishConfig.access` settings.

After the package names exist on npm, configure trusted publishing for each
published package with:

- owner: `Eselfin31`
- repository: `PioneerUI`
- workflow filename: `release.yml`
- allowed action: `npm publish`

Then publish future releases from GitHub by publishing a GitHub Release or
running the Release workflow manually.

The publishable package manifests include repository metadata for
`https://github.com/Eselfin31/PioneerUI`.
