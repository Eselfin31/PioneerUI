import { AlertTriangle } from "lucide-react"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function AppErrorState(): React.ReactElement {
  return (
    <Card className="mx-auto grid max-w-lg gap-4 p-8">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-[color-mix(in_srgb,var(--status-error)_12%,transparent)] p-2 text-[var(--status-error)]">
          <AlertTriangle className="h-5 w-5" strokeWidth={2} />
        </div>
        <div>
          <h2 className="font-semibold">Sync failed</h2>
          <p className="text-sm text-[var(--text-secondary)]">The registry could not refresh local block metadata.</p>
        </div>
      </div>
      <Button className="w-fit" variant="secondary">Retry sync</Button>
    </Card>
  )
}

