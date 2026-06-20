import * as React from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const members = [
  { name: "Mira Rosten", initials: "MR", role: "Owner", status: "Active" },
  { name: "Evan Vale", initials: "EV", role: "Designer", status: "Invited" },
  { name: "Noor Calder", initials: "NC", role: "Engineer", status: "Active" }
] as const

export function TeamMembersPage(): React.ReactElement {
  return (
    <main className="mx-auto grid max-w-5xl gap-6 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Team members</h1>
        <Button>Invite member</Button>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Access</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-[var(--border-subtle)]">
          {members.map((member) => (
            <div className="flex items-center justify-between py-3" key={member.name}>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{member.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-[var(--text-secondary)]">{member.role}</div>
                </div>
              </div>
              <Badge tone={member.status === "Active" ? "success" : "warning"}>{member.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  )
}

