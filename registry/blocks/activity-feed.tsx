import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const events = [
  { title: "Registry build passed", time: "09:42", tone: "success" },
  { title: "Billing block updated", time: "10:16", tone: "info" },
  { title: "Docs screenshot pending", time: "11:03", tone: "warning" }
] as const

export function ActivityFeed(): React.ReactElement {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {events.map((event) => (
          <div className="flex items-center justify-between" key={event.title}>
            <span className="text-sm">{event.title}</span>
            <Badge tone={event.tone}>{event.time}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

