import type { Metadata } from "next"
import type * as React from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Pioneer UI Next Example",
  description: "Next.js smoke target for Pioneer UI blocks",
}

export default function RootLayout({
  children,
}: Readonly<{
  readonly children: React.ReactNode
}>): React.ReactElement {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
