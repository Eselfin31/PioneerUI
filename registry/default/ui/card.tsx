import * as React from "react"
import { cn } from "@/lib/utils"

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-panel)] border border-[var(--border-default)] bg-[var(--surface-elevated)] shadow-[0_1px_2px_rgba(15,23,42,0.06)]",
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return <div className={cn("space-y-1.5 p-5", className)} {...props} />
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>): React.ReactElement {
  return <h3 className={cn("text-base font-semibold text-[var(--text-primary)]", className)} {...props} />
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return <div className={cn("p-5 pt-0", className)} {...props} />
}

