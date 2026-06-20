import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

const notifications = ["Release failures", "Weekly digest", "Billing alerts"] as const

export function NotificationsPage(): React.ReactElement {
  return (
    <main className="mx-auto grid max-w-4xl gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {notifications.map((label) => (
            <label className="flex items-center justify-between" key={label}>
              <span className="text-sm font-medium">{label}</span>
              <Switch defaultChecked={label !== "Billing alerts"} />
            </label>
          ))}
        </CardContent>
      </Card>
    </main>
  )
}

