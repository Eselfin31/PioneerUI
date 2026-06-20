import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import * as React from "react"
import { cn } from "@/lib/utils"

export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

export function DropdownMenuContent({ className, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>): React.ReactElement {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        className={cn("z-50 min-w-44 rounded-[var(--radius-panel)] border border-[var(--border-default)] bg-[var(--surface-elevated)] p-1 shadow-[0_18px_50px_rgba(15,23,42,0.18)]", className)}
        sideOffset={6}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

export function DropdownMenuItem({ className, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>): React.ReactElement {
  return <DropdownMenuPrimitive.Item className={cn("cursor-default rounded-[var(--radius-control)] px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-[var(--surface-secondary)]", className)} {...props} />
}

