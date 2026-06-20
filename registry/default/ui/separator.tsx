import * as React from "react"
import { cn } from "@/lib/utils"

export function Separator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return <div className={cn("h-px w-full bg-[var(--border-subtle)]", className)} role="separator" {...props} />
}

