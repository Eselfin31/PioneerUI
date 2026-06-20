export const pioneerThemeCss = `@theme {
  --font-sans: Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: "Geist Mono", "JetBrains Mono", "SFMono-Regular", Consolas, monospace;
  --color-background: var(--surface-primary);
  --color-foreground: var(--text-primary);
  --color-primary: var(--accent-primary);
  --color-primary-hover: var(--accent-hover);
  --color-muted: var(--surface-secondary);
  --color-border: var(--border-default);
  --radius-control: 0.375rem;
  --radius-panel: 0.5rem;
}`

export const pioneerBaseCss = `@import "tailwindcss";

${pioneerThemeCss}

:root {
  color-scheme: light;
  --surface-primary: #fbfcff;
  --surface-secondary: #f4f7fb;
  --surface-elevated: #ffffff;
  --text-primary: #07111f;
  --text-secondary: #536174;
  --text-tertiary: #8491a5;
  --border-default: #dbe3ef;
  --border-subtle: #edf2f8;
  --accent-primary: #4f46e5;
  --accent-hover: #3730a3;
  --accent-soft: #eef2ff;
  --status-success: #168a4a;
  --status-warning: #a95f00;
  --status-error: #c52d3a;
  --status-info: #2563eb;
}

.dark {
  color-scheme: dark;
  --surface-primary: #0b1020;
  --surface-secondary: #111827;
  --surface-elevated: #172033;
  --text-primary: #f8fbff;
  --text-secondary: #aeb9c9;
  --text-tertiary: #707d92;
  --border-default: #283449;
  --border-subtle: #1d2638;
  --accent-primary: #8b8cff;
  --accent-hover: #a5b4fc;
  --accent-soft: #20264a;
  --status-success: #3ddc84;
  --status-warning: #f5b84b;
  --status-error: #ff6b7a;
  --status-info: #76a9ff;
}

body {
  background: var(--surface-primary);
  color: var(--text-primary);
  font-family: var(--font-sans);
}`
