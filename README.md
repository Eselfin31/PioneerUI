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

The public docs and registry are currently served from the `gh-pages` branch at
`https://Eselfin31.github.io/PioneerUI/`. The branch contains the generated
`apps/docs/dist` output, including `registry/index.json`.

Build the docs for the project Pages path before refreshing that branch:

```powershell
$env:PIONEER_DOCS_BASE = "/PioneerUI/"
npx pnpm@11.8.0 build
```

On POSIX shells:

```bash
PIONEER_DOCS_BASE=/PioneerUI/ npx pnpm@11.8.0 build
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
account with ownership of the target scope/name, including the `@pioneer-ui`
npm organization scope. The scoped packages publish as public packages through
their manifest `publishConfig.access` settings.
Keep the first `pioneer-ui` CLI publish on `0.1.1` or later; npm registry
history already contains an unpublished `pioneer-ui@0.1.0`, and npm does not
allow reusing an already-published package/version pair.

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
