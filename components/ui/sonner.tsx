"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4 text-primary" />
        ),
        info: (
          <InfoIcon className="size-4 text-primary" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4 text-primary" />
        ),
        error: (
          <OctagonXIcon className="size-4 text-primary" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin text-primary" />
        ),
      }}
      toastOptions={{
        classNames: {
          toast:
            "cn-toast rounded-2xl border border-amber-200/80 bg-primary-soft text-foreground shadow-lg shadow-amber-100/50",
          title: "text-sm font-semibold text-dark",
          description: "text-sm text-foreground/80",
          closeButton:
            "border border-amber-200/80 bg-white text-primary hover:bg-primary-soft",
          actionButton: "bg-primary text-white hover:bg-dark",
          cancelButton:
            "border border-amber-300 bg-white text-primary hover:bg-primary-soft",
          success: "border-amber-300/80",
          error: "border-amber-300/80",
          warning: "border-amber-300/80",
          info: "border-amber-300/80",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
