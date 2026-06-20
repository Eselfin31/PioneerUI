import * as React from "react"
import { cn } from "@/lib/utils"

export type ToastProps = React.HTMLAttributes<HTMLDivElement> & {
  readonly tone?: "info" | "success" | "warning" | "error"
}

const tones = {
  info: "border-[var(--status-info)]",
  success: "border-[var(--status-success)]",
  warning: "border-[var(--status-warning)]",
  error: "border-[var(--status-error)]"
} as const

export function Toast({ className, tone = "info", ...props }: ToastProps): React.ReactElement {
  return (
    <div
      className={cn("rounded-[var(--radius-panel)] border-l-4 bg-[var(--surface-elevated)] px-4 py-3 text-sm shadow-[0_18px_50px_rgba(15,23,42,0.14)]", tones[tone], className)}
      role="status"
      {...props}
    />
  )
}

