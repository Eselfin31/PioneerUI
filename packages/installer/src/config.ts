import { z } from "zod"

export const pioneerConfigSchema = z.object({
  $schema: z.string().optional(),
  framework: z.literal("react"),
  styling: z.literal("tailwind"),
  css: z.string().min(1),
  registry: z.string().min(1),
  aliases: z.object({
    ui: z.string().min(1),
    components: z.string().min(1),
    hooks: z.string().min(1),
    lib: z.string().min(1),
  }),
  metadata: z.string().default(".pioneer/installed.json"),
})

export type PioneerConfig = Readonly<z.infer<typeof pioneerConfigSchema>>

export const defaultPioneerConfig: PioneerConfig = {
  $schema: "https://pioneer-ui.dev/schema/pioneer.json",
  framework: "react",
  styling: "tailwind",
  css: "src/styles.css",
  registry: "https://Eselfin31.github.io/PioneerUI/registry/index.json",
  aliases: {
    ui: "src/components/ui",
    components: "src/components",
    hooks: "src/hooks",
    lib: "src/lib",
  },
  metadata: ".pioneer/installed.json",
}
