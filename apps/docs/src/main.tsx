import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { DocsApp } from "./App.js"
import "./styles.css"

const root = document.getElementById("root")

if (!root) {
  throw new Error("Docs root element is missing")
}

createRoot(root).render(
  <StrictMode>
    <DocsApp />
  </StrictMode>,
)
