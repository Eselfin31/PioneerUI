import { readdir, readFile } from "node:fs/promises"
import { join } from "node:path"
import type { RegistryIndex } from "./schema.js"
import { registryIndexSchema, registryItemSchema } from "./schema.js"

export async function buildRegistryIndex(itemsDirectory: string): Promise<RegistryIndex> {
  const entries = await readdir(itemsDirectory)
  const items = []

  for (const entry of entries.sort((left, right) => left.localeCompare(right))) {
    if (!entry.endsWith(".json")) {
      continue
    }

    const text = await readFile(join(itemsDirectory, entry), "utf8")
    items.push(registryItemSchema.parse(JSON.parse(text)))
  }

  return registryIndexSchema.parse({
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    items,
  })
}
