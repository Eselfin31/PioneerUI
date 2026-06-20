import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { pathToFileURL } from "node:url"
import {
  createInstallPlan,
  defaultPioneerConfig,
  pioneerConfigSchema,
  renderInstallPlanDiff,
  runDoctor,
  writeInstallPlan,
  writeJsonFile,
} from "@pioneer-ui/installer"
import { loadRegistryIndex, resolveRegistryItems } from "@pioneer-ui/registry"
import { assertNever, formatList } from "@pioneer-ui/shared"
import { pioneerBaseCss } from "@pioneer-ui/tokens"
import { optionValue } from "./args.js"
import type { CliIo } from "./io.js"
import { resolveRegistryLocation, runRegistryCommand } from "./registry.js"

type CliCommand = "init" | "add" | "diff" | "update" | "doctor" | "registry"

export type { CliIo } from "./io.js"

type InstallMode = "plan" | "diff"

type InstallRequest = {
  readonly args: readonly string[]
  readonly io: CliIo
  readonly mode: InstallMode
}

const localRegistrySource = "registry/default"

export async function runCli(argv: readonly string[], io: CliIo): Promise<void> {
  const [command, ...args] = argv

  switch (command) {
    case "init":
      await initProject(args, io)
      return
    case "add":
    case "update":
      await installItems({ args, io, mode: "plan" })
      return
    case "diff":
      await installItems({ args, io, mode: "diff" })
      return
    case "doctor":
      await doctor(io)
      return
    case "registry":
      await runRegistryCommand(args, io)
      return
    default:
      printHelp(command, io.stdout)
  }
}

async function initProject(args: readonly string[], io: CliIo): Promise<void> {
  const projectRoot = io.cwd
  if (!args.includes("--write")) {
    io.stdout("Would create pioneer.json and CSS tokens. Re-run with --write to apply.")
    return
  }

  const registry = optionValue(args, "--registry") ?? defaultPioneerConfig.registry
  await writeJsonFile(join(projectRoot, "pioneer.json"), { ...defaultPioneerConfig, registry })
  await mkdir(dirname(join(projectRoot, defaultPioneerConfig.css)), { recursive: true })
  await writeFile(join(projectRoot, defaultPioneerConfig.css), pioneerBaseCss)
  io.stdout("Created pioneer.json and base Pioneer CSS tokens.")
}

async function installItems(request: InstallRequest): Promise<void> {
  const { args, io, mode } = request
  const write = args.includes("--write")
  const registrySource = optionValue(args, "--registry") ?? (await configuredRegistry(io.cwd))
  const registryLocation = await resolveRegistryLocation(io.cwd, registrySource)
  const names = itemNames(args)
  if (names.length === 0) {
    throw new Error("No registry items requested.")
  }
  const index = await loadRegistryIndex(registryLocation.indexSource)
  const resolvedItems = resolveRegistryItems(index, names)

  if (resolvedItems.kind === "missing") {
    throw new Error(`Missing registry items: ${formatList(resolvedItems.names)}`)
  }

  const plan = await createInstallPlan({
    projectRoot: io.cwd,
    registryRoot: registryLocation.sourceRoot,
    files: resolvedItems.files,
    dependencies: resolvedItems.dependencies,
    devDependencies: resolvedItems.devDependencies,
  })

  if (mode === "diff") {
    io.stdout(await renderInstallPlanDiff(plan))
    return
  }

  io.stdout(renderPlan(plan.actions.map(renderInstallAction)))
  if (write) {
    await writeInstallPlan(plan)
    io.stdout("Installed registry files.")
  }
}

async function configuredRegistry(projectRoot: string): Promise<string> {
  try {
    const config = pioneerConfigSchema.parse(
      JSON.parse(await readFile(join(projectRoot, "pioneer.json"), "utf8")),
    )
    return config.registry
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return localRegistrySource
    }
    throw new Error("pioneer.json is invalid. Re-run pioneer init --write or pass --registry.")
  }
}

async function doctor(io: CliIo): Promise<void> {
  const report = await runDoctor(io.cwd)
  if (report.issues.length === 0) {
    io.stdout("Pioneer project looks healthy.")
    return
  }

  for (const issue of report.issues) {
    io.stdout(`${issue.code}: ${issue.message}`)
  }
}

function itemNames(args: readonly string[]): readonly string[] {
  const names: string[] = []
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]
    if (arg === undefined) {
      continue
    }
    if (arg === "--registry") {
      index += 1
      continue
    }
    if (arg === "--write" || arg.startsWith("--")) {
      continue
    }
    names.push(arg)
  }
  return names
}

function renderInstallAction(
  action: Awaited<ReturnType<typeof createInstallPlan>>["actions"][number],
): string {
  switch (action.kind) {
    case "write_file":
      return JSON.stringify({
        kind: action.kind,
        source: action.source,
        target: action.target,
        state: action.state,
      })
    case "install_dependency":
      return JSON.stringify(action)
    default:
      assertNever(action)
  }
}

function renderPlan(lines: readonly string[]): string {
  return ["Pioneer install plan:", ...lines.map((line) => `- ${line}`)].join("\n")
}

function printHelp(command: string | undefined, write: (message: string) => void): void {
  const knownCommands: readonly CliCommand[] = [
    "init",
    "add",
    "diff",
    "update",
    "doctor",
    "registry",
  ]
  write(`Pioneer UI CLI

Commands: ${knownCommands.join(", ")}
Current command: ${command ?? "none"}

Examples:
  pioneer init --write --registry <registry-url>
  pioneer add dashboard-shell --write
  pioneer add dashboard-shell --write --registry registry/default
  pioneer doctor
  pioneer registry build`)
}

function isDirectRun(): boolean {
  const scriptPath = process.argv[1]
  return scriptPath !== undefined && import.meta.url === pathToFileURL(scriptPath).href
}

if (isDirectRun()) {
  runCli(process.argv.slice(2), {
    cwd: process.cwd(),
    stderr: console.error,
    stdout: console.log,
  }).catch((error: unknown) => {
    if (error instanceof Error) {
      console.error(error.message)
      process.exit(1)
    }

    console.error("Unknown CLI failure")
    process.exit(1)
  })
}
