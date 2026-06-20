import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] text-sm font-medium transition-[color,background,transform,border-color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-hover)]",
        secondary:
          "border border-[var(--border-default)] bg-[var(--surface-elevated)] text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]",
        ghost: "text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]",
        destructive: "bg-[var(--status-error)] text-white hover:brightness-95"
      },
      size: {
        sm: "h-8 px-3",
        md: "h-10 px-4",
        lg: "h-11 px-5"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
)

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    readonly loading?: boolean
  }

export function Button({
  className,
  variant,
  size,
  loading = false,
  children,
  disabled,
  ...props
}: ButtonProps): React.ReactElement {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      type={props.type ?? "button"}
      {...props}
    >
      {loading ? <span className="h-2 w-2 rounded-full bg-current opacity-70" /> : null}
      {children}
    </button>
  )
}

