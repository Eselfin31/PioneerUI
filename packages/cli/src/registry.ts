import { copyFile, mkdir, readFile, stat, writeFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import { buildRegistryIndex, type RegistryIndex, registryIndexSchema } from "@pioneer-ui/registry"
import { optionValue } from "./args.js"
import type { CliIo } from "./io.js"

type RegistryLocation = {
  readonly indexSource: string
  readonly sourceRoot: string
}

export async function runRegistryCommand(args: readonly string[], io: CliIo): Promise<void> {
  const [subcommand] = args
  if (subcommand !== "build") {
    printRegistryHelp(io.stdout)
    return
  }

  const registrySource = optionValue(args, "--registry") ?? "registry/default"
  const outPath = optionValue(args, "--out")
  if (isHttpUrl(registrySource)) {
    throw new Error("registry build requires a local registry directory.")
  }

  const registryRoot = resolve(io.cwd, registrySource)
  const index = await buildRegistryIndex(resolve(registryRoot, "items"))
  if (outPath === null) {
    const payload = `${JSON.stringify(index, null, 2)}\n`
    io.stdout(payload.trimEnd())
    return
  }

  const target = resolve(io.cwd, outPath)
  const stableIndex = await preserveGeneratedAt(target, index)
  const payload = `${JSON.stringify(stableIndex, null, 2)}\n`
  const publicRegistryRoot = dirname(target)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, payload)
  await copyRegistrySources(stableIndex, registryRoot, publicRegistryRoot)
  io.stdout(`Wrote registry index to ${target}`)
}

export async function resolveRegistryLocation(
  cwd: string,
  source: string,
): Promise<RegistryLocation> {
  if (isHttpUrl(source)) {
    return {
      indexSource: source,
      sourceRoot: httpRegistrySourceRoot(source),
    }
  }

  const absoluteSource = resolve(cwd, source)
  const sourceStat = await stat(absoluteSource)
  return {
    indexSource: absoluteSource,
    sourceRoot: sourceStat.isDirectory() ? absoluteSource : dirname(absoluteSource),
  }
}

function httpRegistrySourceRoot(source: string): string {
  return source.endsWith(".json") ? new URL(".", source).href : source
}

function isHttpUrl(value: string): boolean {
  return value.startsWith("https://") || value.startsWith("http://")
}

async function copyRegistrySources(
  index: RegistryIndex,
  registryRoot: string,
  publicRegistryRoot: string,
): Promise<void> {
  for (const item of index.items) {
    for (const file of item.files) {
      const source = join(registryRoot, file.source)
      const target = join(publicRegistryRoot, file.source)
      await mkdir(dirname(target), { recursive: true })
      await copyFile(source, target)
    }
  }
}

async function preserveGeneratedAt(
  target: string,
  nextIndex: RegistryIndex,
): Promise<RegistryIndex> {
  const existingIndex = await readExistingRegistryIndex(target)
  if (existingIndex === null || !hasSameRegistryContent(existingIndex, nextIndex)) {
    return nextIndex
  }

  return { ...nextIndex, generatedAt: existingIndex.generatedAt }
}

async function readExistingRegistryIndex(target: string): Promise<RegistryIndex | null> {
  try {
    return registryIndexSchema.parse(JSON.parse(await readFile(target, "utf8")))
  } catch (error) {
    if (isMissingFileError(error) || error instanceof SyntaxError || isZodError(error)) {
      return null
    }
    throw error
  }
}

function isMissingFileError(error: unknown): boolean {
  return error instanceof Error && "code" in error && error.code === "ENOENT"
}

function isZodError(error: unknown): boolean {
  return error instanceof Error && error.name === "ZodError"
}

function hasSameRegistryContent(left: RegistryIndex, right: RegistryIndex): boolean {
  return JSON.stringify(registryContent(left)) === JSON.stringify(registryContent(right))
}

function registryContent(index: RegistryIndex): Pick<RegistryIndex, "items" | "schemaVersion"> {
  return {
    schemaVersion: index.schemaVersion,
    items: index.items,
  }
}

function printRegistryHelp(write: (message: string) => void): void {
  write(`Pioneer UI CLI

Commands: registry build`)
}
