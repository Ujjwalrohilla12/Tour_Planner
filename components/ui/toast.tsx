"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ToastProps {
  title?: string
  description?: string
  variant?: "default" | "destructive"
  onClose?: () => void
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ title, description, variant = "default", onClose, ...props }, ref) => {
    React.useEffect(() => {
      const timer = setTimeout(() => {
        onClose?.()
      }, 5000)
      return () => clearTimeout(timer)
    }, [onClose])

    return (
      <div
        ref={ref}
        className={cn(
          "fixed top-4 right-4 z-50 w-full max-w-sm rounded-lg border p-4 shadow-lg transition-all",
          variant === "default" && "bg-background border-border",
          variant === "destructive" && "bg-destructive text-destructive-foreground border-destructive"
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          <div className="flex-1">
            {title && <div className="font-semibold">{title}</div>}
            {description && <div className="text-sm opacity-90">{description}</div>}
          </div>
          <button
            onClick={onClose}
            className="text-sm opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      </div>
    )
  }
)
Toast.displayName = "Toast"

export { Toast }