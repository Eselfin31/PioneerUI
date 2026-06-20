import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ExampleApp } from "./ExampleApp.js"
import "./styles.css"

const root = document.getElementById("root")

if (!root) {
  throw new Error("Example root element is missing")
}

createRoot(root).render(
  <StrictMode>
    <ExampleApp />
  </StrictMode>,
)
