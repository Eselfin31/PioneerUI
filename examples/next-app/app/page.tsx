import type * as React from "react"

const states = ["Registry ready", "Diff safe", "Blocks installed"] as const

export default function Page(): React.ReactElement {
  return (
    <main className="min-h-[100dvh] bg-[var(--surface-primary)] p-6 text-[var(--text-primary)]">
      <section className="mx-auto grid max-w-4xl gap-5 rounded-[1rem] border border-[var(--border-default)] bg-[var(--surface-elevated)] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
          Next smoke
        </p>
        <h1 className="text-3xl font-semibold">Pioneer UI app shell target</h1>
        <p className="max-w-2xl text-[var(--text-secondary)]">
          This example keeps the Next target simple so the installer can prove app-router
          compatibility before richer blocks are copied in.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {states.map((state) => (
            <div
              className="rounded-[var(--radius-panel)] border border-[var(--border-default)] bg-[var(--surface-secondary)] px-3 py-2 text-sm"
              key={state}
            >
              {state}
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
