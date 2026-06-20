import * as React from "react"
import { cn } from "@/lib/utils"

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>): React.ReactElement {
  return <table className={cn("w-full caption-bottom text-sm", className)} {...props} />
}

export function THead({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>): React.ReactElement {
  return <thead className={cn("border-b border-[var(--border-default)]", className)} {...props} />
}

export function TRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>): React.ReactElement {
  return <tr className={cn("border-b border-[var(--border-subtle)] transition-colors hover:bg-[var(--surface-secondary)]", className)} {...props} />
}

export function TH({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>): React.ReactElement {
  return <th className={cn("h-10 px-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]", className)} {...props} />
}

export function TD({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>): React.ReactElement {
  return <td className={cn("px-3 py-3 text-[var(--text-secondary)]", className)} {...props} />
}

