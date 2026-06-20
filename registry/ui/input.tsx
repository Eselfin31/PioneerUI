import * as React from "react"
import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export function Input({ className, ...props }: InputProps): React.ReactElement {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-[var(--radius-control)] border border-[var(--border-default)] bg-[var(--surface-elevated)] px-3 text-sm text-[var(--text-primary)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] outline-none transition-colors placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-soft)] disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    />
  )
}

