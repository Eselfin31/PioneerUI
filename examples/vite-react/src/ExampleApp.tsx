import { Bell, Search } from "lucide-react"
import type * as React from "react"

const metrics = [
  { label: "Pipeline", value: "$248.6k" },
  { label: "Activation", value: "68.4%" },
  { label: "Open risks", value: "17" },
] as const

export function ExampleApp(): React.ReactElement {
  return (
    <main className="min-h-[100dvh] bg-[var(--surface-primary)] p-6 text-[var(--text-primary)]">
      <section className="mx-auto grid max-w-6xl gap-6">
        <header className="flex flex-col gap-4 rounded-[1rem] border border-[var(--border-default)] bg-[var(--surface-elevated)] p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              Vite smoke
            </p>
            <h1 className="text-3xl font-semibold">Pioneer dashboard shell</h1>
          </div>
          <div className="flex gap-2">
            <button
              className="inline-flex h-10 items-center gap-2 rounded-[var(--radius-control)] border border-[var(--border-default)] px-4 text-sm"
              type="button"
            >
              <Search className="h-4 w-4" strokeWidth={2} />
              Search
            </button>
            <button
              className="inline-flex h-10 items-center gap-2 rounded-[var(--radius-control)] bg-[var(--accent-primary)] px-4 text-sm font-medium text-white"
              type="button"
            >
              <Bell className="h-4 w-4" strokeWidth={2} />
              Alerts
            </button>
          </div>
        </header>
        <div className="grid gap-4 md:grid-cols-3">
          {metrics.map((metric) => (
            <article
              className="rounded-[var(--radius-panel)] border border-[var(--border-default)] bg-[var(--surface-elevated)] p-5"
              key={metric.label}
            >
              <p className="text-sm text-[var(--text-secondary)]">{metric.label}</p>
              <p className="mt-2 font-mono text-3xl font-semibold">{metric.value}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
