import { access } from "node:fs/promises"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"
import { buildRegistryIndex, resolveRegistryItems } from "../src/index.js"

const registryRoot = resolve(process.cwd(), "registry/default")
const itemsRoot = resolve(registryRoot, "items")

describe("Pioneer registry", () => {
  it("resolves dashboard shell with transitive dependencies", async () => {
    // Given: the launch registry item directory.
    const index = await buildRegistryIndex(itemsRoot)

    // When: a flagship block is resolved.
    const result = resolveRegistryItems(index, ["dashboard-shell"])

    // Then: the install tree includes the block and required primitives.
    expect(result.kind).toBe("resolved")
    if (result.kind !== "resolved") {
      throw new Error("Expected registry resolution to succeed")
    }
    expect(result.items.map((item) => item.name)).toContain("button")
    expect(result.items.map((item) => item.name)).toContain("dashboard-shell")
    expect(result.dependencies).toContain("lucide-react@1.21.0")
  })

  it("points every registry file at an existing source template", async () => {
    // Given: all registry item metadata.
    const index = await buildRegistryIndex(itemsRoot)

    // When/Then: every declared source file exists.
    await Promise.all(
      index.items.flatMap((item) =>
        item.files.map((file) => access(resolve(registryRoot, file.source))),
      ),
    )
  })

  it("reports missing item names", async () => {
    // Given: the launch registry.
    const index = await buildRegistryIndex(itemsRoot)

    // When: an unknown item is requested.
    const result = resolveRegistryItems(index, ["unknown-block"])

    // Then: the missing name is returned explicitly.
    expect(result).toEqual({ kind: "missing", names: ["unknown-block"] })
  })
})
