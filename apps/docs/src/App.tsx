import { ArrowRight, Blocks, Code2, GitBranch, ShieldCheck, Sparkles } from "lucide-react"
import type * as React from "react"

const primitives = [
  "button",
  "input",
  "dialog",
  "dropdown-menu",
  "tabs",
  "toast",
  "table",
  "select",
] as const

const blocks = [
  "dashboard-shell",
  "settings-page",
  "billing-page",
  "team-members-page",
  "data-table-page",
  "onboarding-checklist",
] as const

const commands = [
  "npx pioneer-ui@latest init --write --registry https://Eselfin31.github.io/PioneerUI/registry/index.json",
  "npx pioneer-ui@latest add dashboard-shell settings-page --write",
  "npx pioneer-ui@latest diff dashboard-shell",
] as const

export function DocsApp(): React.ReactElement {
  return (
    <main className="min-h-[100dvh] bg-[var(--surface-primary)] text-[var(--text-primary)]">
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[1fr_520px] lg:py-16">
        <div className="flex flex-col justify-center">
          <div className="mb-5 flex w-fit items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--surface-elevated)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">
            <Sparkles className="h-3.5 w-3.5 text-[var(--accent-primary)]" strokeWidth={2} />
            Public launch kit for React and Tailwind
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05]">
            App blocks, safe updates, and source you own.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
            Pioneer UI gives public developers a shadcn-like workflow with broader SaaS blocks and a
            CLI that shows diffs before touching local code.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              className="inline-flex h-10 items-center gap-2 rounded-[var(--radius-control)] bg-[var(--accent-primary)] px-4 text-sm font-medium text-white transition-transform active:translate-y-px"
              href="#install"
            >
              Start with the CLI
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
            <a
              className="inline-flex h-10 items-center rounded-[var(--radius-control)] border border-[var(--border-default)] bg-[var(--surface-elevated)] px-4 text-sm font-medium text-[var(--text-primary)]"
              href="#blocks"
            >
              Browse blocks
            </a>
          </div>
        </div>
        <div className="rounded-[1rem] border border-[var(--border-default)] bg-[var(--surface-elevated)] p-4 shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
          <div className="rounded-[0.75rem] bg-[var(--surface-secondary)] p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold">Launch console</span>
              <span className="rounded-full bg-[var(--accent-soft)] px-2 py-1 text-xs font-medium text-[var(--accent-primary)]">
                Live registry
              </span>
            </div>
            <div className="grid gap-3">
              {["Registry validated", "12 SaaS blocks", "Safe diff ready"].map((label) => (
                <div
                  className="flex items-center justify-between rounded-[var(--radius-panel)] border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-3"
                  key={label}
                >
                  <span className="text-sm">{label}</span>
                  <ShieldCheck className="h-4 w-4 text-[var(--status-success)]" strokeWidth={2} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-16 md:grid-cols-3">
        <FeatureCard
          icon={<Blocks className="h-5 w-5" strokeWidth={2} />}
          title="Broad app blocks"
          text="Dashboard, billing, security, onboarding, team, table, and state blocks are first-class launch assets."
        />
        <FeatureCard
          icon={<GitBranch className="h-5 w-5" strokeWidth={2} />}
          title="GitHub registry"
          text="A transparent custom registry format keeps source, metadata, and contribution review in one public repo."
        />
        <FeatureCard
          icon={<Code2 className="h-5 w-5" strokeWidth={2} />}
          title="Guided updates"
          text="The CLI plans writes, detects conflicts, and makes local edits visible before updates apply."
        />
      </section>
      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-16 lg:grid-cols-2" id="blocks">
        <RegistryPanel title="Primitives" items={primitives} />
        <RegistryPanel title="SaaS blocks" items={blocks} />
      </section>
      <section className="mx-auto max-w-7xl px-6 pb-20" id="install">
        <div className="rounded-[1rem] border border-[var(--border-default)] bg-[var(--surface-elevated)] p-5">
          <h2 className="text-2xl font-semibold">CLI workflow</h2>
          <div className="mt-4 grid gap-3">
            {commands.map((command) => (
              <code
                className="block min-w-0 max-w-full whitespace-pre-wrap break-words rounded-[var(--radius-control)] bg-[var(--surface-secondary)] px-3 py-2 font-mono text-sm text-[var(--text-secondary)] [overflow-wrap:anywhere]"
                key={command}
              >
                {command}
              </code>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

type FeatureCardProps = {
  readonly icon: React.ReactNode
  readonly title: string
  readonly text: string
}

function FeatureCard({ icon, title, text }: FeatureCardProps): React.ReactElement {
  return (
    <article className="rounded-[var(--radius-panel)] border border-[var(--border-default)] bg-[var(--surface-elevated)] p-5">
      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-[var(--radius-control)] bg-[var(--accent-soft)] text-[var(--accent-primary)]">
        {icon}
      </div>
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{text}</p>
    </article>
  )
}

type RegistryPanelProps = {
  readonly title: string
  readonly items: readonly string[]
}

function RegistryPanel({ title, items }: RegistryPanelProps): React.ReactElement {
  return (
    <section className="rounded-[1rem] border border-[var(--border-default)] bg-[var(--surface-elevated)] p-5">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <div
            className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] bg-[var(--surface-secondary)] px-3 py-2 font-mono text-sm text-[var(--text-secondary)]"
            key={item}
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  )
}
