"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        `peer border size-5 shrink-0 rounded-sm bg-background
        data-[state=checked]:bg-asecondary data-[state=checked]:text-background data-[state=checked]:border-asecondary data-[state=checked]:border-2
        focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[2px] 
        aria-invalid:ring-destructive/20 aria-invalid:border-destructive 
        disabled:cursor-not-allowed disabled:opacity-50` /* dark:bg-input/30 dark:data-[state=checked]:bg-aprimary dark:aria-invalid:ring-destructive/40 */,
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
