import { access, readFile } from "node:fs/promises"
import { join } from "node:path"
import type { PioneerConfig } from "./config.js"
import { pioneerConfigSchema } from "./config.js"

export type DoctorIssue = {
  readonly code: "missing_config" | "invalid_config" | "missing_css" | "missing_alias"
  readonly message: string
}

export type DoctorReport = {
  readonly config: PioneerConfig | null
  readonly issues: readonly DoctorIssue[]
}

export async function runDoctor(projectRoot: string): Promise<DoctorReport> {
  const configPath = join(projectRoot, "pioneer.json")
  const config = await readConfig(configPath)

  if (config.kind === "missing" || config.kind === "invalid") {
    return { config: null, issues: [config.issue] }
  }

  const issues = await validateProjectFiles(projectRoot, config.value)
  return { config: config.value, issues }
}

type ConfigReadResult =
  | { readonly kind: "ok"; readonly value: PioneerConfig }
  | { readonly kind: "missing"; readonly issue: DoctorIssue }
  | { readonly kind: "invalid"; readonly issue: DoctorIssue }

async function readConfig(configPath: string): Promise<ConfigReadResult> {
  try {
    const parsed = pioneerConfigSchema.parse(JSON.parse(await readFile(configPath, "utf8")))
    return { kind: "ok", value: parsed }
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return { kind: "missing", issue: issue("missing_config", "Missing pioneer.json") }
    }
    return { kind: "invalid", issue: issue("invalid_config", "pioneer.json is invalid") }
  }
}

async function validateProjectFiles(
  projectRoot: string,
  config: PioneerConfig,
): Promise<readonly DoctorIssue[]> {
  const issues: DoctorIssue[] = []
  await pushIfMissing(
    issues,
    join(projectRoot, config.css),
    issue("missing_css", "CSS entry is missing"),
  )

  for (const aliasPath of Object.values(config.aliases)) {
    await pushIfMissing(
      issues,
      join(projectRoot, aliasPath),
      issue("missing_alias", `Alias target is missing: ${aliasPath}`),
    )
  }

  return issues
}

async function pushIfMissing(
  issues: DoctorIssue[],
  path: string,
  missingIssue: DoctorIssue,
): Promise<void> {
  try {
    await access(path)
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      issues.push(missingIssue)
      return
    }
    throw error
  }
}

function issue(code: DoctorIssue["code"], message: string): DoctorIssue {
  return { code, message }
}
