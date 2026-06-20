import { BarChart3, Bell, CreditCard, LayoutDashboard, Search, Settings, Shield } from "lucide-react"
import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Revenue", icon: BarChart3 },
  { label: "Billing", icon: CreditCard },
  { label: "Security", icon: Shield },
  { label: "Settings", icon: Settings }
] as const

const metrics = [
  { label: "Pipeline value", value: "$248.6k", change: "+12.8%" },
  { label: "Activation", value: "68.4%", change: "+4.1%" },
  { label: "Open risks", value: "17", change: "-3" }
] as const

export function DashboardShell(): React.ReactElement {
  return (
    <div className="grid min-h-[100dvh] bg-[var(--surface-primary)] text-[var(--text-primary)] lg:grid-cols-[260px_1fr]">
      <aside className="border-r border-[var(--border-default)] bg-[var(--surface-secondary)] p-4">
        <div className="mb-6 flex items-center justify-between">
          <span className="font-semibold">Pioneer Console</span>
          <Badge tone="info">Launch</Badge>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <a className="flex items-center gap-2 rounded-[var(--radius-control)] px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]" href="/" key={item.label}>
              <item.icon className="h-4 w-4" strokeWidth={2} />
              {item.label}
            </a>
          ))}
        </nav>
      </aside>
      <main className="p-4 lg:p-6">
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">Workspace</p>
            <h1 className="text-3xl font-semibold">Launch operations</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">
              <Search className="h-4 w-4" strokeWidth={2} />
              Search
            </Button>
            <Button>
              <Bell className="h-4 w-4" strokeWidth={2} />
              Review alerts
            </Button>
          </div>
        </header>
        <section className="grid gap-4 md:grid-cols-3">
          {metrics.map((metric) => (
            <Card key={metric.label}>
              <CardHeader>
                <CardTitle>{metric.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">{metric.value}</div>
                <p className="mt-2 text-sm text-[var(--status-success)]">{metric.change} this cycle</p>
              </CardContent>
            </Card>
          ))}
        </section>
        <Separator className="my-6" />
        <Card>
          <CardHeader>
            <CardTitle>Release readiness</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            <Badge tone="success">Registry validated</Badge>
            <Badge tone="warning">3 docs pages need copy</Badge>
            <Badge tone="info">Vite and Next examples passing</Badge>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

