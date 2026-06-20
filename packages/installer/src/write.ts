import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { z } from "zod"
import type { InstallAction, InstallPlan } from "./plan.js"

const packageManifestSchema = z
  .object({
    dependencies: z.record(z.string(), z.string()).optional(),
    devDependencies: z.record(z.string(), z.string()).optional(),
  })
  .passthrough()

type InstallDependencyAction = Extract<InstallAction, { readonly kind: "install_dependency" }>

type PackageSpec = {
  readonly name: string
  readonly version: string
}

export async function writeInstallPlan(plan: InstallPlan): Promise<void> {
  if (plan.hasConflicts) {
    throw new Error("Install plan has conflicts. Run diff before overwriting local files.")
  }

  for (const action of plan.actions) {
    if (action.kind !== "write_file" || action.state === "unchanged") {
      continue
    }

    await mkdir(dirname(action.target), { recursive: true })
    await writeFile(action.target, action.sourceText)
  }

  const dependencyActions = plan.actions.filter(isDependencyAction)
  if (dependencyActions.length > 0) {
    await writePackageManifestDependencies(plan.projectRoot, dependencyActions)
  }
}

export async function writeJsonFile(path: string, value: unknown): Promise<void> {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`)
}

export async function readTextIfPresent(path: string): Promise<string | null> {
  try {
    return await readFile(path, "utf8")
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return null
    }
    throw error
  }
}

async function writePackageManifestDependencies(
  projectRoot: string,
  actions: readonly InstallDependencyAction[],
): Promise<void> {
  const manifestPath = join(projectRoot, "package.json")
  const packageManifestText = await readTextIfPresent(manifestPath)
  const packageManifest =
    packageManifestText === null ? {} : packageManifestSchema.parse(JSON.parse(packageManifestText))
  const dependencies = mergeDependencyGroup(packageManifest.dependencies ?? {}, actions, false)
  const devDependencies = mergeDependencyGroup(packageManifest.devDependencies ?? {}, actions, true)

  await writeJsonFile(manifestPath, {
    ...packageManifest,
    ...(Object.keys(dependencies).length > 0 ? { dependencies } : {}),
    ...(Object.keys(devDependencies).length > 0 ? { devDependencies } : {}),
  })
}

function mergeDependencyGroup(
  current: Readonly<Record<string, string>>,
  actions: readonly InstallDependencyAction[],
  dev: boolean,
): Readonly<Record<string, string>> {
  const next: Record<string, string> = { ...current }
  for (const action of actions) {
    if (action.dev !== dev) {
      continue
    }

    const packageSpec = parsePackageSpec(action.packageName)
    next[packageSpec.name] ??= packageSpec.version
  }

  return sortRecord(next)
}

function parsePackageSpec(packageSpec: string): PackageSpec {
  const versionSeparator = packageSpec.lastIndexOf("@")
  if (versionSeparator <= 0) {
    return { name: packageSpec, version: "latest" }
  }

  return {
    name: packageSpec.slice(0, versionSeparator),
    version: packageSpec.slice(versionSeparator + 1),
  }
}

function sortRecord(record: Readonly<Record<string, string>>): Readonly<Record<string, string>> {
  return Object.fromEntries(
    Object.entries(record).sort(([left], [right]) => left.localeCompare(right)),
  )
}

function isDependencyAction(action: InstallAction): action is InstallDependencyAction {
  return action.kind === "install_dependency"
}
