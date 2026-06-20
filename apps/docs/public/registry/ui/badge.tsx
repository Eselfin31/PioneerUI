import * as React from "react"
import { cn } from "@/lib/utils"

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  readonly tone?: "neutral" | "success" | "warning" | "error" | "info"
}

const tones = {
  neutral: "bg-[var(--surface-secondary)] text-[var(--text-secondary)]",
  success: "bg-[color-mix(in_srgb,var(--status-success)_12%,transparent)] text-[var(--status-success)]",
  warning: "bg-[color-mix(in_srgb,var(--status-warning)_12%,transparent)] text-[var(--status-warning)]",
  error: "bg-[color-mix(in_srgb,var(--status-error)_12%,transparent)] text-[var(--status-error)]",
  info: "bg-[color-mix(in_srgb,var(--status-info)_12%,transparent)] text-[var(--status-info)]"
} as const

export function Badge({ className, tone = "neutral", ...props }: BadgeProps): React.ReactElement {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-control)] px-2 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
      {...props}
    />
  )
}

