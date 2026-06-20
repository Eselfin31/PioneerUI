import { readFile, stat } from "node:fs/promises"
import { join } from "node:path"
import ky from "ky"
import { buildRegistryIndex } from "./build.js"
import type { RegistryIndex, RegistryItem } from "./schema.js"
import { registryIndexSchema, registryItemSchema } from "./schema.js"

export async function loadRegistryIndex(source: string): Promise<RegistryIndex> {
  if (!source.startsWith("https://") && !source.startsWith("http://")) {
    const sourceStat = await stat(source)
    if (sourceStat.isDirectory()) {
      return buildRegistryIndex(join(source, "items"))
    }
  }

  const raw = await loadJson(source)
  return registryIndexSchema.parse(raw)
}

export async function loadRegistryItem(source: string): Promise<RegistryItem> {
  const raw = await loadJson(source)
  return registryItemSchema.parse(raw)
}

async function loadJson(source: string): Promise<unknown> {
  if (source.startsWith("https://") || source.startsWith("http://")) {
    return ky.get(source).json<unknown>()
  }

  const text = await readFile(source, "utf8")
  return JSON.parse(text)
}
