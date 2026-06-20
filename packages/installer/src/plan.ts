import { readFile } from "node:fs/promises"
import { join } from "node:path"
import type { RegistryFile } from "@pioneer-ui/registry"
import ky from "ky"

export type InstallAction =
  | {
      readonly kind: "write_file"
      readonly source: string
      readonly sourceText: string
      readonly target: string
      readonly state: "create" | "unchanged" | "conflict"
    }
  | { readonly kind: "install_dependency"; readonly packageName: string; readonly dev: boolean }

export type InstallPlan = {
  readonly projectRoot: string
  readonly actions: readonly InstallAction[]
  readonly hasConflicts: boolean
}

type FileAction = Extract<InstallAction, { readonly kind: "write_file" }>

export type InstallPlanInput = {
  readonly projectRoot: string
  readonly registryRoot: string
  readonly files: readonly RegistryFile[]
  readonly dependencies: readonly string[]
  readonly devDependencies: readonly string[]
}

export async function createInstallPlan(input: InstallPlanInput): Promise<InstallPlan> {
  const fileActions = await Promise.all(
    input.files.map((file) => createFileAction(input.projectRoot, input.registryRoot, file)),
  )
  const dependencyActions = [
    ...input.dependencies.map((packageName) => dependencyAction(packageName, false)),
    ...input.devDependencies.map((packageName) => dependencyAction(packageName, true)),
  ]
  const actions = [...fileActions, ...dependencyActions]

  return {
    projectRoot: input.projectRoot,
    actions,
    hasConflicts: fileActions.some((action) => action.state === "conflict"),
  }
}

async function createFileAction(
  projectRoot: string,
  registryRoot: string,
  file: RegistryFile,
): Promise<FileAction> {
  const source = resolveRegistrySource(registryRoot, file.source)
  const target = join(projectRoot, file.target)
  const sourceText = await readSourceText(source)

  try {
    const targetText = await readFile(target, "utf8")
    return {
      kind: "write_file",
      source,
      sourceText,
      target,
      state: sourceText === targetText ? "unchanged" : "conflict",
    }
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return { kind: "write_file", source, sourceText, target, state: "create" }
    }
    throw error
  }
}

function dependencyAction(packageName: string, dev: boolean): InstallAction {
  return { kind: "install_dependency", packageName, dev }
}

function resolveRegistrySource(registryRoot: string, source: string): string {
  if (isHttpUrl(registryRoot)) {
    const root = registryRoot.endsWith("/") ? registryRoot : `${registryRoot}/`
    return new URL(source, root).href
  }

  return join(registryRoot, source)
}

async function readSourceText(source: string): Promise<string> {
  if (isHttpUrl(source)) {
    return ky.get(source).text()
  }

  return readFile(source, "utf8")
}

function isHttpUrl(value: string): boolean {
  return value.startsWith("https://") || value.startsWith("http://")
}
