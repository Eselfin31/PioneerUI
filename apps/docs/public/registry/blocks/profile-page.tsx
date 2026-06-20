import * as React from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ProfilePage(): React.ReactElement {
  return (
    <main className="mx-auto grid max-w-4xl gap-6 p-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar>
            <AvatarFallback>MR</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>Mira Rosten</CardTitle>
            <p className="text-sm text-[var(--text-secondary)]">Product engineer at Northstar Labs</p>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="profile-name">Name</Label>
            <Input id="profile-name" defaultValue="Mira Rosten" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="profile-role">Role</Label>
            <Input id="profile-role" defaultValue="Product engineer" />
          </div>
          <Button className="md:col-span-2 md:w-fit">Update profile</Button>
        </CardContent>
      </Card>
    </main>
  )
}

