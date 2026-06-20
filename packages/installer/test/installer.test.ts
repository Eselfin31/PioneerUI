import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises"
import { createServer, type Server } from "node:http"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { buildRegistryIndex, resolveRegistryItems } from "@pioneer-ui/registry"
import { describe, expect, it } from "vitest"
import { createInstallPlan, writeInstallPlan } from "../src/index.js"

const registryRoot = resolve(process.cwd(), "registry/default")

describe("Pioneer installer", () => {
  it("creates a safe install plan for a new project", async () => {
    // Given: a fresh project and a resolved block tree.
    const projectRoot = await mkdtemp(join(tmpdir(), "pioneer-install-"))
    const index = await buildRegistryIndex(resolve(registryRoot, "items"))
    const resolved = resolveRegistryItems(index, ["settings-page"])
    if (resolved.kind !== "resolved") {
      throw new Error("Expected settings-page to resolve")
    }

    // When: the install plan is created.
    const plan = await createInstallPlan({
      projectRoot,
      registryRoot,
      files: resolved.files,
      dependencies: resolved.dependencies,
      devDependencies: resolved.devDependencies,
    })

    // Then: files are planned as creates with no conflicts.
    expect(plan.hasConflicts).toBe(false)
    expect(plan.actions).toContainEqual(
      expect.objectContaining({ kind: "write_file", state: "create" }),
    )
  })

  it("marks locally changed files as conflicts", async () => {
    // Given: a project with an edited target file.
    const projectRoot = await mkdtemp(join(tmpdir(), "pioneer-conflict-"))
    const index = await buildRegistryIndex(resolve(registryRoot, "items"))
    const resolved = resolveRegistryItems(index, ["button"])
    if (resolved.kind !== "resolved") {
      throw new Error("Expected button to resolve")
    }
    const buttonTarget = join(projectRoot, "src/components/ui/button.tsx")
    await mkdir(dirname(buttonTarget), { recursive: true })
    await writeFile(buttonTarget, "export function LocalButton() { return null }\n")

    // When: the install plan is created.
    const plan = await createInstallPlan({
      projectRoot,
      registryRoot,
      files: resolved.files,
      dependencies: resolved.dependencies,
      devDependencies: resolved.devDependencies,
    })

    // Then: the plan refuses silent overwrite.
    expect(plan.hasConflicts).toBe(true)
    expect(plan.actions).toContainEqual(
      expect.objectContaining({ kind: "write_file", state: "conflict" }),
    )
  })

  it("installs source files from an HTTP registry root", async () => {
    // Given: a project and a registry source served over HTTP.
    const projectRoot = await mkdtemp(join(tmpdir(), "pioneer-http-install-"))
    const registry = await createHttpRegistry({
      "/registry/ui/remote-button.tsx": "export function RemoteButton() { return null }\n",
    })

    try {
      // When: the install plan is written.
      const plan = await createInstallPlan({
        projectRoot,
        registryRoot: `${registry.origin}/registry`,
        files: [
          {
            role: "component",
            source: "ui/remote-button.tsx",
            target: "src/components/ui/remote-button.tsx",
          },
        ],
        dependencies: [],
        devDependencies: [],
      })
      await writeInstallPlan(plan)

      // Then: the HTTP source file is installed into the project.
      await expect(
        import("node:fs/promises").then(({ readFile }) =>
          readFile(join(projectRoot, "src/components/ui/remote-button.tsx"), "utf8"),
        ),
      ).resolves.toBe("export function RemoteButton() { return null }\n")
    } finally {
      await registry.close()
    }
  })

  it("writes dependency actions into package manifests", async () => {
    // Given: a project with an existing package manifest.
    const projectRoot = await mkdtemp(join(tmpdir(), "pioneer-dependency-install-"))
    await writeFile(
      join(projectRoot, "package.json"),
      `${JSON.stringify({ type: "module", dependencies: { react: "^19.0.0" } }, null, 2)}\n`,
    )

    // When: an install plan with runtime and development dependencies is written.
    const plan = await createInstallPlan({
      projectRoot,
      registryRoot,
      files: [],
      dependencies: ["lucide-react@1.21.0", "clsx@2.1.1"],
      devDependencies: ["tailwindcss@4.1.0"],
    })
    await writeInstallPlan(plan)

    // Then: package.json includes the registry dependencies without removing existing entries.
    const packageJson = await readFile(join(projectRoot, "package.json"), "utf8")
    expect(packageJson).toContain('"react": "^19.0.0"')
    expect(packageJson).toContain('"lucide-react": "1.21.0"')
    expect(packageJson).toContain('"clsx": "2.1.1"')
    expect(packageJson).toContain('"tailwindcss": "4.1.0"')
  })
})

type HttpRegistry = {
  readonly close: () => Promise<void>
  readonly origin: string
}

async function createHttpRegistry(routes: Readonly<Record<string, string>>): Promise<HttpRegistry> {
  const server = createServer((request, response) => {
    const body = request.url === undefined ? undefined : routes[request.url]
    if (body === undefined) {
      response.writeHead(404)
      response.end("Not found")
      return
    }

    response.writeHead(200, { "content-type": "text/plain; charset=utf-8" })
    response.end(body)
  })
  await listen(server)
  const address = server.address()
  if (typeof address !== "object" || address === null) {
    throw new Error("Expected HTTP registry to listen on a TCP port")
  }

  return {
    close: () => close(server),
    origin: `http://127.0.0.1:${address.port}`,
  }
}

async function listen(server: Server): Promise<void> {
  await new Promise<void>((resolveListen) => {
    server.listen(0, "127.0.0.1", resolveListen)
  })
}

async function close(server: Server): Promise<void> {
  await new Promise<void>((resolveClose, rejectClose) => {
    server.close((error) => {
      if (error instanceof Error) {
        rejectClose(error)
        return
      }
      resolveClose()
    })
  })
}
