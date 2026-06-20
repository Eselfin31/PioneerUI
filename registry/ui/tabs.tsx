import * as TabsPrimitive from "@radix-ui/react-tabs"
import * as React from "react"
import { cn } from "@/lib/utils"

export const Tabs = TabsPrimitive.Root

export function TabsList({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>): React.ReactElement {
  return <TabsPrimitive.List className={cn("inline-flex rounded-[var(--radius-panel)] border border-[var(--border-default)] bg-[var(--surface-secondary)] p-1", className)} {...props} />
}

export function TabsTrigger({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>): React.ReactElement {
  return <TabsPrimitive.Trigger className={cn("rounded-[var(--radius-control)] px-3 py-1.5 text-sm text-[var(--text-secondary)] transition-colors data-[state=active]:bg-[var(--surface-elevated)] data-[state=active]:text-[var(--text-primary)]", className)} {...props} />
}

export const TabsContent = TabsPrimitive.Content

