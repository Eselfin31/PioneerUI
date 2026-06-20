import { FolderSearch } from "lucide-react"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function EmptyState(): React.ReactElement {
  return (
    <Card className="mx-auto grid max-w-lg place-items-center gap-4 p-10 text-center">
      <div className="rounded-full bg-[var(--accent-soft)] p-3 text-[var(--accent-primary)]">
        <FolderSearch className="h-6 w-6" strokeWidth={2} />
      </div>
      <div>
        <h2 className="text-xl font-semibold">No reports yet</h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">Create the first report or import an existing workspace archive.</p>
      </div>
      <Button>Create report</Button>
    </Card>
  )
}

