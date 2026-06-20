import { z } from "zod"

export const itemKinds = ["primitive", "block", "hook", "lib", "theme"] as const
export const fileRoles = ["component", "block", "hook", "lib", "style"] as const
export const stabilityLevels = ["experimental", "candidate", "stable"] as const

export const registryFileSchema = z.object({
  role: z.enum(fileRoles),
  source: z.string().min(1),
  target: z.string().min(1),
})

export const registryTokensSchema = z
  .object({
    css: z.string().optional(),
    tailwind: z.string().optional(),
  })
  .default({})

export const registryDocsSchema = z.object({
  route: z.string().min(1),
  examples: z.array(z.string().min(1)).default([]),
})

export const registryPreviewSchema = z.object({
  image: z.string().min(1),
  viewport: z.enum(["mobile", "tablet", "desktop"]).default("desktop"),
})

export const registryItemSchema = z.object({
  name: z.string().regex(/^[a-z0-9-]+$/),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  kind: z.enum(itemKinds),
  title: z.string().min(1),
  description: z.string().min(1),
  files: z.array(registryFileSchema).min(1),
  dependencies: z.array(z.string().min(1)).default([]),
  devDependencies: z.array(z.string().min(1)).default([]),
  requires: z.array(z.string().regex(/^[a-z0-9-]+$/)).default([]),
  tokens: registryTokensSchema,
  preview: registryPreviewSchema.optional(),
  docs: registryDocsSchema,
  stability: z.enum(stabilityLevels),
})

export const registryIndexSchema = z.object({
  schemaVersion: z.literal(1),
  generatedAt: z.string().datetime(),
  items: z.array(registryItemSchema),
})

export type RegistryFile = Readonly<z.infer<typeof registryFileSchema>>
export type RegistryItem = Readonly<z.infer<typeof registryItemSchema>>
export type RegistryIndex = Readonly<z.infer<typeof registryIndexSchema>>
