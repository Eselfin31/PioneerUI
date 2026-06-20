import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TD, TH, THead, TRow } from "@/components/ui/table"

const rows = [
  { account: "Atlas Works", owner: "Mira Rosten", value: "$24,800", status: "Review" },
  { account: "Copperline", owner: "Noor Calder", value: "$18,420", status: "Active" },
  { account: "Kepler Studio", owner: "Evan Vale", value: "$9,760", status: "Paused" }
] as const

export function DataTablePage(): React.ReactElement {
  return (
    <main className="mx-auto grid max-w-6xl gap-6 p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Accounts</CardTitle>
          <Button variant="secondary">Export</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TRow>
                <TH>Account</TH>
                <TH>Owner</TH>
                <TH>Value</TH>
                <TH>Status</TH>
              </TRow>
            </THead>
            <tbody>
              {rows.map((row) => (
                <TRow key={row.account}>
                  <TD>{row.account}</TD>
                  <TD>{row.owner}</TD>
                  <TD className="font-mono">{row.value}</TD>
                  <TD><Badge>{row.status}</Badge></TD>
                </TRow>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}

