import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

const config = defineConfig({
  resolve: {
    alias: {
      "@pioneer-ui/installer": fileURLToPath(
        new URL("./packages/installer/src/index.ts", import.meta.url),
      ),
      "@pioneer-ui/registry": fileURLToPath(
        new URL("./packages/registry/src/index.ts", import.meta.url),
      ),
      "@pioneer-ui/shared": fileURLToPath(
        new URL("./packages/shared/src/index.ts", import.meta.url),
      ),
      "@pioneer-ui/tokens": fileURLToPath(
        new URL("./packages/tokens/src/index.ts", import.meta.url),
      ),
    },
  },
  test: {
    environment: "node",
    include: ["packages/*/test/**/*.test.ts"],
    restoreMocks: true,
  },
})

export default config
