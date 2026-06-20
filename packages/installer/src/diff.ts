import { readFile } from "node:fs/promises"
import { relative } from "node:path"
import type { RegistryFile } from "@pioneer-ui/registry"
import { assertNever } from "@pioneer-ui/shared"
import type { InstallAction, InstallPlan } from "./plan.js"

export type FileDiff =
  | { readonly kind: "missing"; readonly target: string }
  | { readonly kind: "changed"; readonly target: string }
  | { readonly kind: "unchanged"; readonly target: string }

export async function diffRegistryFile(source: string, target: string): Promise<FileDiff> {
  const sourceText = await readFile(source, "utf8")

  try {
    const targetText = await readFile(target, "utf8")
    return sourceText === targetText ? { kind: "unchanged", target } : { kind: "changed", target }
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return { kind: "missing", target }
    }
    throw error
  }
}

export function summarizeTargets(files: readonly RegistryFile[]): readonly string[] {
  return files.map((file) => file.target).sort((left, right) => left.localeCompare(right))
}

type FileAction = Extract<InstallAction, { readonly kind: "write_file" }>

export async function renderInstallPlanDiff(plan: InstallPlan): Promise<string> {
  const sections = await Promise.all(
    plan.actions
      .filter(isChangedFileAction)
      .map((action) => renderFileDiff(plan.projectRoot, action)),
  )
  const changedSections = sections.filter((section) => section.length > 0)

  return changedSections.length === 0 ? "No file changes." : changedSections.join("\n")
}

function isChangedFileAction(action: InstallAction): action is FileAction {
  return action.kind === "write_file" && action.state !== "unchanged"
}

async function renderFileDiff(projectRoot: string, action: FileAction): Promise<string> {
  const targetPath = normalizePath(relative(projectRoot, action.target))

  switch (action.state) {
    case "create":
      return renderCreateDiff(targetPath, action.sourceText)
    case "conflict": {
      const targetText = await readFile(action.target, "utf8")
      return renderChangedDiff(targetPath, targetText, action.sourceText)
    }
    case "unchanged":
      return ""
    default:
      assertNever(action.state)
  }
}

function renderCreateDiff(targetPath: string, sourceText: string): string {
  return [
    `diff --pioneer ${targetPath}`,
    "--- /dev/null",
    `+++ ${targetPath}`,
    "@@",
    prefixLines(sourceText, "+"),
  ].join("\n")
}

function renderChangedDiff(targetPath: string, targetText: string, sourceText: string): string {
  return [
    `diff --pioneer ${targetPath}`,
    `--- ${targetPath}`,
    `+++ ${targetPath}`,
    "@@",
    prefixLines(targetText, "-"),
    prefixLines(sourceText, "+"),
  ].join("\n")
}

function prefixLines(text: string, prefix: string): string {
  return normalizeText(text)
    .split("\n")
    .filter((line, index, lines) => line.length > 0 || index < lines.length - 1)
    .map((line) => `${prefix}${line}`)
    .join("\n")
}

function normalizeText(text: string): string {
  return text.replace(/\r\n/g, "\n")
}

function normalizePath(path: string): string {
  return path.replace(/\\/g, "/")
}
