import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import * as React from "react"
import { cn } from "@/lib/utils"

export const TooltipProvider = TooltipPrimitive.Provider
export const Tooltip = TooltipPrimitive.Root
export const TooltipTrigger = TooltipPrimitive.Trigger

export function TooltipContent({ className, ...props }: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>): React.ReactElement {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content className={cn("z-50 rounded-[var(--radius-control)] bg-[var(--text-primary)] px-2 py-1 text-xs text-[var(--surface-primary)] shadow-[0_18px_50px_rgba(15,23,42,0.18)]", className)} sideOffset={6} {...props} />
    </TooltipPrimitive.Portal>
  )
}

