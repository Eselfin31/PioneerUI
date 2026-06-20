import { uniqueSorted } from "@pioneer-ui/shared"
import type { RegistryFile, RegistryIndex, RegistryItem } from "./schema.js"

export type ResolveResult =
  | {
      readonly kind: "resolved"
      readonly items: readonly RegistryItem[]
      readonly files: readonly RegistryFile[]
      readonly dependencies: readonly string[]
      readonly devDependencies: readonly string[]
    }
  | { readonly kind: "missing"; readonly names: readonly string[] }

export function resolveRegistryItems(
  index: RegistryIndex,
  names: readonly string[],
): ResolveResult {
  const byName = new Map(index.items.map((item) => [item.name, item]))
  const missing = new Set<string>()
  const visited = new Set<string>()
  const items: RegistryItem[] = []

  for (const name of names) {
    visitItem(name, byName, visited, missing, items)
  }

  if (missing.size > 0) {
    return { kind: "missing", names: Array.from(missing).sort() }
  }

  return {
    kind: "resolved",
    items,
    files: items.flatMap((item) => item.files),
    dependencies: uniqueSorted(items.flatMap((item) => item.dependencies)),
    devDependencies: uniqueSorted(items.flatMap((item) => item.devDependencies)),
  }
}

function visitItem(
  name: string,
  byName: ReadonlyMap<string, RegistryItem>,
  visited: Set<string>,
  missing: Set<string>,
  items: RegistryItem[],
): void {
  if (visited.has(name)) {
    return
  }

  const item = byName.get(name)
  if (!item) {
    missing.add(name)
    return
  }

  visited.add(name)
  for (const dependency of item.requires) {
    visitItem(dependency, byName, visited, missing, items)
  }
  items.push(item)
}
