import { mkdtemp, readFile } from "node:fs/promises"
import { createServer, type Server } from "node:http"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { runCli } from "../src/index.js"

describe("Pioneer CLI configured registry", () => {
  it("writes the public raw GitHub registry by default", async () => {
    // Given: a new project with no explicit registry flag.
    const projectRoot = await mkdtemp(join(tmpdir(), "pioneer-cli-default-registry-"))

    // When: init writes the project config.
    await runCli(["init", "--write"], {
      cwd: projectRoot,
      stderr: () => undefined,
      stdout: () => undefined,
    })

    // Then: add/diff/update will use the live GitHub-hosted registry by default.
    await expect(readFile(join(projectRoot, "pioneer.json"), "utf8")).resolves.toContain(
      "https://raw.githubusercontent.com/Eselfin31/PioneerUI/main/apps/docs/public/registry/index.json",
    )
  })

  it("installs from the registry written by init", async () => {
    // Given: a public registry and a project initialized with that registry URL.
    const projectRoot = await mkdtemp(join(tmpdir(), "pioneer-cli-configured-registry-"))
    const index = {
      schemaVersion: 1,
      generatedAt: "2026-06-19T00:00:00.000Z",
      items: [
        {
          name: "configured-button",
          version: "0.1.0",
          kind: "primitive",
          title: "Configured Button",
          description: "Button installed through project registry config.",
          files: [
            {
              role: "component",
              source: "ui/configured-button.tsx",
              target: "src/components/ui/configured-button.tsx",
            },
          ],
          dependencies: [],
          devDependencies: [],
          requires: [],
          tokens: {},
          docs: {
            route: "/docs/components/configured-button",
            examples: [],
          },
          stability: "experimental",
        },
      ],
    } as const
    const registry = await createHttpRegistry({
      "/registry/index.json": JSON.stringify(index),
      "/registry/ui/configured-button.tsx": "export function ConfiguredButton() { return null }\n",
    })
    const registryUrl = `${registry.origin}/registry/index.json`

    try {
      // When: init stores the registry and add runs without an explicit registry flag.
      await runCli(["init", "--write", "--registry", registryUrl], {
        cwd: projectRoot,
        stderr: () => undefined,
        stdout: () => undefined,
      })
      await runCli(["add", "configured-button", "--write"], {
        cwd: projectRoot,
        stderr: () => undefined,
        stdout: () => undefined,
      })

      // Then: the component is installed from the configured HTTP registry.
      await expect(readFile(join(projectRoot, "pioneer.json"), "utf8")).resolves.toContain(
        registryUrl,
      )
      await expect(
        readFile(join(projectRoot, "src/components/ui/configured-button.tsx"), "utf8"),
      ).resolves.toBe("export function ConfiguredButton() { return null }\n")
    } finally {
      await registry.close()
    }
  })
})

type HttpRegistry = {
  readonly close: () => Promise<void>
  readonly origin: string
}

async function createHttpRegistry(routes: Readonly<Record<string, string>>): Promise<HttpRegistry> {
  const server = createServer((request, response) => {
    const requestPath = request.url
    if (requestPath === undefined) {
      response.writeHead(404)
      response.end("Not found")
      return
    }

    const body = routes[requestPath]
    if (body === undefined) {
      response.writeHead(404)
      response.end("Not found")
      return
    }

    response.writeHead(200, { "content-type": contentType(requestPath) })
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

function contentType(path: string): string {
  return path.endsWith(".json") ? "application/json; charset=utf-8" : "text/plain; charset=utf-8"
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
