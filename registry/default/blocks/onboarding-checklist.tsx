import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

const steps = ["Install CLI", "Add dashboard shell", "Customize tokens", "Ship docs"] as const

export function OnboardingChecklist(): React.ReactElement {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Launch checklist</CardTitle>
        <Badge tone="info">2 of 4</Badge>
      </CardHeader>
      <CardContent className="grid gap-3">
        {steps.map((step, index) => (
          <label className="flex items-center gap-3 rounded-[var(--radius-control)] border border-[var(--border-subtle)] p-3" key={step}>
            <Checkbox checked={index < 2} />
            <span className="text-sm">{step}</span>
          </label>
        ))}
        <Button className="w-fit">Continue setup</Button>
      </CardContent>
    </Card>
  )
}

