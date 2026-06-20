import { mkdir, mkdtemp, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { buildRegistryIndex, resolveRegistryItems } from "@pioneer-ui/registry"
import { describe, expect, it } from "vitest"
import { createInstallPlan, renderInstallPlanDiff } from "../src/index.js"

const registryRoot = resolve(process.cwd(), "registry/default")

describe("Pioneer installer diffs", () => {
  it("renders source additions when a target file is missing", async () => {
    // Given: a fresh project and a resolved primitive.
    const projectRoot = await mkdtemp(join(tmpdir(), "pioneer-diff-missing-"))
    const index = await buildRegistryIndex(resolve(registryRoot, "items"))
    const resolved = resolveRegistryItems(index, ["button"])
    if (resolved.kind !== "resolved") {
      throw new Error("Expected button to resolve")
    }

    // When: a diff is rendered for the install plan.
    const plan = await createInstallPlan({
      projectRoot,
      registryRoot,
      files: resolved.files,
      dependencies: resolved.dependencies,
      devDependencies: resolved.devDependencies,
    })
    const diff = await renderInstallPlanDiff(plan)

    // Then: the diff shows the file as a registry addition.
    expect(diff).toContain("+++ src/components/ui/button.tsx")
    expect(diff).toContain('+import * as React from "react"')
  })

  it("renders local and registry content when a target file changed", async () => {
    // Given: a project with a local edit in a registry-owned target.
    const projectRoot = await mkdtemp(join(tmpdir(), "pioneer-diff-changed-"))
    const index = await buildRegistryIndex(resolve(registryRoot, "items"))
    const resolved = resolveRegistryItems(index, ["button"])
    if (resolved.kind !== "resolved") {
      throw new Error("Expected button to resolve")
    }
    const buttonTarget = join(projectRoot, "src/components/ui/button.tsx")
    await mkdir(dirname(buttonTarget), { recursive: true })
    await writeFile(buttonTarget, "export function LocalButton() { return null }\n")

    // When: a diff is rendered for the install plan.
    const plan = await createInstallPlan({
      projectRoot,
      registryRoot,
      files: resolved.files,
      dependencies: resolved.dependencies,
      devDependencies: resolved.devDependencies,
    })
    const diff = await renderInstallPlanDiff(plan)

    // Then: the diff shows both the local removal and registry addition.
    expect(diff).toContain("--- src/components/ui/button.tsx")
    expect(diff).toContain("-export function LocalButton() { return null }")
    expect(diff).toContain('+import * as React from "react"')
  })
})
