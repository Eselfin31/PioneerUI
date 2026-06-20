import * as SwitchPrimitive from "@radix-ui/react-switch"
import * as React from "react"
import { cn } from "@/lib/utils"

export function Switch({ className, ...props }: React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>): React.ReactElement {
  return (
    <SwitchPrimitive.Root
      className={cn("h-6 w-10 rounded-full bg-[var(--border-default)] p-0.5 transition-colors data-[state=checked]:bg-[var(--accent-primary)]", className)}
      {...props}
    >
      <SwitchPrimitive.Thumb className="block h-5 w-5 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-4" />
    </SwitchPrimitive.Root>
  )
}

