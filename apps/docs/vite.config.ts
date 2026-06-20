import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const docsBase = process.env.PIONEER_DOCS_BASE ?? "/"
const normalizedDocsBase = docsBase.endsWith("/") ? docsBase : `${docsBase}/`

const config = defineConfig({
  base: normalizedDocsBase,
  plugins: [react(), tailwindcss()],
})

export default config
