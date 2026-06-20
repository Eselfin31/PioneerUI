import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function SettingsPage(): React.ReactElement {
  return (
    <main className="mx-auto grid max-w-5xl gap-6 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">Settings</p>
        <h1 className="text-3xl font-semibold">Workspace preferences</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="workspace-name">Workspace name</Label>
            <Input id="workspace-name" defaultValue="Northstar Labs" />
          </div>
          <label className="flex items-center justify-between rounded-[var(--radius-panel)] border border-[var(--border-default)] p-4">
            <span>
              <span className="block text-sm font-medium">Weekly launch digest</span>
              <span className="text-sm text-[var(--text-secondary)]">Send release summaries every Monday.</span>
            </span>
            <Switch defaultChecked />
          </label>
          <Button className="w-fit">Save changes</Button>
        </CardContent>
      </Card>
    </main>
  )
}

