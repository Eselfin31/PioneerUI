import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import * as React from "react"
import { cn } from "@/lib/utils"

export function Checkbox({ className, ...props }: React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>): React.ReactElement {
  return (
    <CheckboxPrimitive.Root
      className={cn("flex h-4 w-4 items-center justify-center rounded border border-[var(--border-default)] bg-[var(--surface-elevated)] text-white data-[state=checked]:border-[var(--accent-primary)] data-[state=checked]:bg-[var(--accent-primary)]", className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator>
        <Check className="h-3 w-3" strokeWidth={2} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

