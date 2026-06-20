import * as SelectPrimitive from "@radix-ui/react-select"
import { ChevronDown } from "lucide-react"
import * as React from "react"
import { cn } from "@/lib/utils"

export const Select = SelectPrimitive.Root
export const SelectValue = SelectPrimitive.Value

export function SelectTrigger({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>): React.ReactElement {
  return (
    <SelectPrimitive.Trigger className={cn("flex h-10 w-full items-center justify-between rounded-[var(--radius-control)] border border-[var(--border-default)] bg-[var(--surface-elevated)] px-3 text-sm", className)} {...props}>
      {children}
      <SelectPrimitive.Icon>
        <ChevronDown className="h-4 w-4" strokeWidth={2} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

export function SelectContent({ className, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>): React.ReactElement {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content className={cn("z-50 rounded-[var(--radius-panel)] border border-[var(--border-default)] bg-[var(--surface-elevated)] p-1 shadow-[0_18px_50px_rgba(15,23,42,0.18)]", className)} {...props} />
    </SelectPrimitive.Portal>
  )
}

export function SelectItem({ className, ...props }: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>): React.ReactElement {
  return <SelectPrimitive.Item className={cn("rounded-[var(--radius-control)] px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-[var(--surface-secondary)]", className)} {...props} />
}

