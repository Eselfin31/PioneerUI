# Pioneer UI Design System

## 1. Atmosphere & Identity

Pioneer UI feels like a polished developer product: crisp, confident, and ready
for real application work. It borrows the restraint of Vercel and the premium
technical finish of Stripe without copying either brand. The signature is a
"launch console" surface language: clean white and charcoal planes, precise
blue-violet interaction accents, compact metadata, and blocks that look useful
before the user edits a line of code.

## 2. Color

### Palette

| Role | Token | Light | Dark | Usage |
| --- | --- | --- | --- | --- |
| Surface/primary | --surface-primary | #fbfcff | #0b1020 | Page canvas |
| Surface/secondary | --surface-secondary | #f4f7fb | #111827 | App chrome and panels |
| Surface/elevated | --surface-elevated | #ffffff | #172033 | Popovers, dialogs, active cards |
| Text/primary | --text-primary | #07111f | #f8fbff | Headlines and body |
| Text/secondary | --text-secondary | #536174 | #aeb9c9 | Supporting copy |
| Text/tertiary | --text-tertiary | #8491a5 | #707d92 | Metadata and disabled text |
| Border/default | --border-default | #dbe3ef | #283449 | Inputs and panels |
| Border/subtle | --border-subtle | #edf2f8 | #1d2638 | Quiet separators |
| Accent/primary | --accent-primary | #4f46e5 | #8b8cff | Primary actions and links |
| Accent/hover | --accent-hover | #3730a3 | #a5b4fc | Hover states |
| Accent/soft | --accent-soft | #eef2ff | #20264a | Selected backgrounds |
| Status/success | --status-success | #168a4a | #3ddc84 | Success states |
| Status/warning | --status-warning | #a95f00 | #f5b84b | Warning states |
| Status/error | --status-error | #c52d3a | #ff6b7a | Errors and destructive states |
| Status/info | --status-info | #2563eb | #76a9ff | Informational states |

### Rules

- Accent colors are for interaction, focus, and selected state only.
- Surfaces use light tonal shifts before shadows.
- Do not introduce raw color values in components; add semantic tokens here first.

## 3. Typography

### Scale

| Level | Size | Weight | Line Height | Tracking | Usage |
| --- | --- | --- | --- | --- | --- |
| Display | 48px | 600 | 1.05 | 0 | Docs hero and launch pages |
| H1 | 36px | 600 | 1.12 | 0 | Page titles |
| H2 | 28px | 600 | 1.2 | 0 | Section titles |
| H3 | 20px | 600 | 1.35 | 0 | Card and block titles |
| Body/lg | 18px | 400 | 1.6 | 0 | Lead copy |
| Body | 16px | 400 | 1.55 | 0 | Default text |
| Body/sm | 14px | 400 | 1.45 | 0 | Secondary text |
| Caption | 12px | 500 | 1.35 | 0.02em | Labels and metadata |
| Overline | 11px | 650 | 1.2 | 0.08em | Section labels |

### Font Stack

- Primary: Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif.
- Mono: "Geist Mono", "JetBrains Mono", "SFMono-Regular", Consolas, monospace.
- Serif: not used.

### Rules

- Dashboard and docs UI use sans-serif only.
- Body text never drops below 14px in rendered components.
- Numeric metrics use the mono stack when density is high.

## 4. Spacing & Layout

### Base Unit

All spacing derives from 4px.

| Token | Value | Usage |
| --- | --- | --- |
| --space-1 | 4px | Icon and text gap |
| --space-2 | 8px | Compact controls |
| --space-3 | 12px | Form field padding |
| --space-4 | 16px | Standard panel padding |
| --space-5 | 20px | Block inner spacing |
| --space-6 | 24px | Comfortable panel padding |
| --space-8 | 32px | Block groups |
| --space-10 | 40px | Page sections |
| --space-12 | 48px | Major page rhythm |
| --space-16 | 64px | Docs page sections |

### Grid

- Max content width: 1200px for docs, 1440px for app shell previews.
- Breakpoints: sm 640px, md 768px, lg 1024px, xl 1280px, 2xl 1536px.
- Use CSS Grid for application shells and data panels.

### Rules

- No magic spacing values in authored components.
- Mobile layouts collapse to one column before content compresses.

## 5. Components

### Button

- Structure: inline-flex button or anchor with icon slots.
- Variants: primary, secondary, ghost, destructive.
- Spacing: `--space-2` horizontal gap, `--space-3`/`--space-4` padding.
- States: hover, active, focus-visible, disabled, loading.
- Accessibility: visible focus ring, disabled semantics, loading text remains readable.
- Motion: 120ms transform and color transitions.

### App Shell

- Structure: sidebar, topbar, main region, contextual right rail when needed.
- Variants: compact, default, analytics.
- Spacing: `--space-4` grid gutters and `--space-6` page padding.
- States: loading, empty, error, collapsed sidebar.
- Accessibility: skip link, semantic regions, keyboard navigable sidebar.
- Motion: sidebar width changes use transform/opacity only where animated.

### Data Panel

- Structure: heading row, controls row, table/list body, footer.
- Variants: table, activity feed, metric group.
- Spacing: `--space-4` internal rhythm.
- States: loading skeleton, empty, filtered empty, error.
- Accessibility: table headers, labelled controls, status messages.
- Motion: skeleton shimmer and row hover only.

## 6. Motion & Interaction

| Type | Duration | Easing | Usage |
| --- | --- | --- | --- |
| Micro | 120ms | ease-out | Button press, focus transition |
| Standard | 220ms | cubic-bezier(0.16, 1, 0.3, 1) | Popovers and tabs |
| Emphasis | 420ms | cubic-bezier(0.16, 1, 0.3, 1) | Docs hero reveal |

### Rules

- Animate transform and opacity only.
- Respect `prefers-reduced-motion`.
- Every interactive element has hover, active, and focus-visible states.

## 7. Depth & Surface

### Strategy

Mixed, with tonal shift first and subtle blue-tinted shadows only for true
elevation.

| Level | Value | Usage |
| --- | --- | --- |
| Border/default | 1px solid var(--border-default) | Cards, forms, data panels |
| Border/subtle | 1px solid var(--border-subtle) | Dividers and quiet panels |
| Shadow/subtle | 0 1px 2px rgba(15, 23, 42, 0.06) | Resting elevated cards |
| Shadow/popover | 0 18px 50px rgba(15, 23, 42, 0.18) | Dialogs and menus |

