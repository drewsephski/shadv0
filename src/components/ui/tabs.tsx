"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

type TabsProps = React.ComponentProps<typeof TabsPrimitive.Root> & {
  enableUrlHash?: boolean
  onTabChange?: (value: string) => void
}

function Tabs({
  className,
  enableUrlHash = false,
  onTabChange,
  defaultValue,
  value,
  onValueChange,
  ...props
}: TabsProps) {
  const [activeTab, setActiveTab] = React.useState<string | undefined>(value || defaultValue)

  // URL hash support
  React.useEffect(() => {
    if (!enableUrlHash) return

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash && hash !== activeTab) {
        setActiveTab(hash)
        onTabChange?.(hash)
      }
    }

    const handleTabChange = (value: string) => {
      setActiveTab(value)
      if (enableUrlHash) {
        window.history.replaceState(null, '', `#${value}`)
      }
      onValueChange?.(value)
      onTabChange?.(value)
    }

    // Initialize from URL hash
    if (enableUrlHash && !activeTab) {
      const hash = window.location.hash.replace('#', '')
      if (hash) {
        setActiveTab(hash)
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [enableUrlHash, activeTab, onValueChange, onTabChange])

  const handleValueChange = React.useCallback((value: string) => {
    setActiveTab(value)
    if (enableUrlHash) {
      window.history.replaceState(null, '', `#${value}`)
    }
    onValueChange?.(value)
    onTabChange?.(value)
  }, [enableUrlHash, onValueChange, onTabChange])

  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      value={activeTab}
      onValueChange={handleValueChange}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-all duration-200 ease-in-out focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm hover:bg-accent/50 dark:hover:bg-accent/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "flex-1 outline-none data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-1 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:slide-out-to-bottom-1 duration-200",
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
