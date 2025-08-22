import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, value, onChange, ...props }: React.ComponentProps<"textarea">) {
  // Check if value is provided without onChange to avoid React warning
  const hasValueWithoutOnChange = value !== undefined && onChange === undefined;

  return (
    <textarea
      value={hasValueWithoutOnChange ? undefined : value}
      onChange={onChange}
      readOnly={hasValueWithoutOnChange}
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-color transition-box-shadowoutline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
