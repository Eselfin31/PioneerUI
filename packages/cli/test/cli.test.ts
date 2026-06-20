import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises"
import { createServer, type Server } from "node:http"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { registryIndexSchema } from "@pioneer-ui/registry"
import { describe, expect, it } from "vitest"
import { runCli } from "../src/index.js"

describe("Pioneer CLI", () => {
  it("installs files from the selected registry root", async () => {
    // Given: a custom registry and an empty project.
    const projectRoot = await mkdtemp(join(tmpdir(), "pioneer-cli-project-"))
    const registryRoot = await mkdtemp(join(tmpdir(), "pioneer-cli-registry-"))
    const sourcePath = join(registryRoot, "ui/custom-button.tsx")
    const itemPath = join(registryRoot, "items/custom-button.json")
    await mkdir(dirname(sourcePath), { recursive: true })
    await mkdir(dirname(itemPath), { recursive: true })
    await writeFile(sourcePath, "export function CustomButton() { return null }\n")
    await writeFile(
      itemPath,
      `${JSON.stringify(
        {
          name: "custom-button",
          version: "0.1.0",
          kind: "primitive",
          title: "Custom Button",
          description: "Registry override test button.",
          files: [
            {
              role: "component",
              source: "ui/custom-button.tsx",
              target: "src/components/ui/custom-button.tsx",
            },
          ],
          dependencies: [],
          devDependencies: [],
          requires: [],
          tokens: {},
          docs: {
            route: "/docs/components/custom-button",
            examples: [],
          },
          stability: "experimental",
        },
        null,
        2,
      )}\n`,
    )
    const output: string[] = []

    // When: add is run with --write and the custom registry root.
    await runCli(["add", "custom-button", "--registry", registryRoot, "--write"], {
      cwd: projectRoot,
      stderr: (message) => output.push(message),
      stdout: (message) => output.push(message),
    })

    // Then: the installed file comes from the custom registry source.
    await expect(
      readFile(join(projectRoot, "src/components/ui/custom-button.tsx"), "utf8"),
    ).resolves.toBe("export function CustomButton() { return null }\n")
    expect(output.join("\n")).toContain("Installed registry files.")
  })

  it("installs files from an HTTP registry index", async () => {
    // Given: a public registry index and source file served over HTTP.
    const projectRoot = await mkdtemp(join(tmpdir(), "pioneer-cli-http-project-"))
    const index = {
      schemaVersion: 1,
      generatedAt: "2026-06-19T00:00:00.000Z",
      items: [
        {
          name: "remote-button",
          version: "0.1.0",
          kind: "primitive",
          title: "Remote Button",
          description: "HTTP registry button.",
          files: [
            {
              role: "component",
              source: "ui/remote-button.tsx",
              target: "src/components/ui/remote-button.tsx",
            },
          ],
          dependencies: [],
          devDependencies: [],
          requires: [],
          tokens: {},
          docs: {
            route: "/docs/components/remote-button",
            examples: [],
          },
          stability: "experimental",
        },
      ],
    } as const
    const registry = await createHttpRegistry({
      "/registry/index.json": JSON.stringify(index),
      "/registry/ui/remote-button.tsx": "export function RemoteButton() { return null }\n",
    })

    try {
      // When: add is run against the HTTP registry index.
      await runCli(
        ["add", "remote-button", "--registry", `${registry.origin}/registry/index.json`, "--write"],
        {
          cwd: projectRoot,
          stderr: () => undefined,
          stdout: () => undefined,
        },
      )

      // Then: the file is installed from the registry URL.
      await expect(
        readFile(join(projectRoot, "src/components/ui/remote-button.tsx"), "utf8"),
      ).resolves.toBe("export function RemoteButton() { return null }\n")
    } finally {
      await registry.close()
    }
  })

  it("writes a generated registry index to an output file", async () => {
    // Given: a custom registry and an output path.
    const projectRoot = await mkdtemp(join(tmpdir(), "pioneer-cli-registry-build-"))
    const registryRoot = join(projectRoot, "registry/default")
    const sourcePath = join(registryRoot, "ui/custom-button.tsx")
    const itemPath = join(registryRoot, "items/custom-button.json")
    const outputPath = join(projectRoot, "public/registry/index.json")
    await mkdir(dirname(sourcePath), { recursive: true })
    await mkdir(dirname(itemPath), { recursive: true })
    await writeFile(sourcePath, "export function CustomButton() { return null }\n")
    await writeFile(
      itemPath,
      `${JSON.stringify(
        {
          name: "custom-button",
          version: "0.1.0",
          kind: "primitive",
          title: "Custom Button",
          description: "Registry build output test button.",
          files: [
            {
              role: "component",
              source: "ui/custom-button.tsx",
              target: "src/components/ui/custom-button.tsx",
            },
          ],
          dependencies: [],
          devDependencies: [],
          requires: [],
          tokens: {},
          docs: {
            route: "/docs/components/custom-button",
            examples: [],
          },
          stability: "experimental",
        },
        null,
        2,
      )}\n`,
    )

    // When: registry build runs with --out.
    await runCli(["registry", "build", "--registry", registryRoot, "--out", outputPath], {
      cwd: projectRoot,
      stderr: () => undefined,
      stdout: () => undefined,
    })

    // Then: the generated index is written as JSON.
    const generated = registryIndexSchema.parse(JSON.parse(await readFile(outputPath, "utf8")))
    expect(generated.items[0]?.name).toBe("custom-button")
    await expect(
      readFile(join(projectRoot, "public/registry/ui/custom-button.tsx"), "utf8"),
    ).resolves.toBe("export function CustomButton() { return null }\n")
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
