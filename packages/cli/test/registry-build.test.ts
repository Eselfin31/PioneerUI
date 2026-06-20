import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { registryIndexSchema } from "@pioneer-ui/registry"
import { describe, expect, it } from "vitest"
import { runCli } from "../src/index.js"

describe("Pioneer registry build", () => {
  it("preserves generatedAt when registry content is unchanged", async () => {
    // Given: an existing generated registry index with unchanged source items.
    const projectRoot = await mkdtemp(join(tmpdir(), "pioneer-registry-stable-"))
    const registryRoot = join(projectRoot, "registry/default")
    const outputPath = join(projectRoot, "public/registry/index.json")
    await writeRegistryItem(registryRoot)
    await runCli(
      ["registry", "build", "--registry", registryRoot, "--out", outputPath],
      silentIo(projectRoot),
    )
    const firstIndex = registryIndexSchema.parse(JSON.parse(await readFile(outputPath, "utf8")))

    // When: the registry is built again without item changes.
    await runCli(
      ["registry", "build", "--registry", registryRoot, "--out", outputPath],
      silentIo(projectRoot),
    )

    // Then: the content is stable instead of changing only the timestamp.
    const secondIndex = registryIndexSchema.parse(JSON.parse(await readFile(outputPath, "utf8")))
    expect(secondIndex.generatedAt).toBe(firstIndex.generatedAt)
    expect(secondIndex.items).toEqual(firstIndex.items)
  })
})

function silentIo(cwd: string): Parameters<typeof runCli>[1] {
  return {
    cwd,
    stderr: () => undefined,
    stdout: () => undefined,
  }
}

async function writeRegistryItem(registryRoot: string): Promise<void> {
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
}
