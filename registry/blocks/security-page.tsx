import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export function SecurityPage(): React.ReactElement {
  return (
    <main className="mx-auto grid max-w-4xl gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Security controls</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <label className="flex items-center justify-between">
            <span>
              <span className="block text-sm font-medium">Require two-factor authentication</span>
              <span className="text-sm text-[var(--text-secondary)]">Applies to all workspace members.</span>
            </span>
            <Switch defaultChecked />
          </label>
          <div className="flex items-center justify-between rounded-[var(--radius-panel)] bg-[var(--surface-secondary)] p-4">
            <Badge tone="success">No active incidents</Badge>
            <Button variant="secondary">View audit log</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

