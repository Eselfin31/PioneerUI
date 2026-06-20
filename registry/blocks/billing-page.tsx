import { CreditCard } from "lucide-react"
import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const invoices = ["INV-4817", "INV-4816", "INV-4815"] as const

export function BillingPage(): React.ReactElement {
  return (
    <main className="mx-auto grid max-w-5xl gap-6 p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Pro workspace</CardTitle>
            <p className="text-sm text-[var(--text-secondary)]">$84 per seat, billed monthly</p>
          </div>
          <Badge tone="success">Active</Badge>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-[var(--accent-primary)]" strokeWidth={2} />
            <span className="text-sm text-[var(--text-secondary)]">Card ending in 4728</span>
          </div>
          <Button variant="secondary">Update payment method</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent invoices</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          {invoices.map((invoice) => (
            <div className="flex items-center justify-between rounded-[var(--radius-control)] bg-[var(--surface-secondary)] px-3 py-2" key={invoice}>
              <span className="font-mono text-sm">{invoice}</span>
              <Button size="sm" variant="ghost">Download</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  )
}

