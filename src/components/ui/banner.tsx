import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { ExternalLink } from "lucide-react"

const bannerVariants = cva(
  "w-full border-b bg-gradient-to-r from-primary/10 via-primary/5 to-transparent backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: "border-primary/20",
        accent: "border-accent/50 bg-gradient-to-r from-accent/10 via-accent/5 to-transparent",
        success: "border-green-500/20 bg-gradient-to-r from-green-500/10 via-green-500/5 to-transparent",
        warning: "border-orange-500/20 bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const bannerContentVariants = cva(
  "container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3",
  {
    variants: {
      size: {
        default: "py-3",
        sm: "py-2",
        lg: "py-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface BannerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bannerVariants> {
  title?: string
  description?: string
  actionText?: string
  actionHref?: string
  onAction?: () => void
  dismissible?: boolean
  onDismiss?: () => void
  size?: VariantProps<typeof bannerContentVariants>["size"]
}

const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  ({ 
    className, 
    variant, 
    title, 
    description, 
    actionText, 
    actionHref, 
    onAction, 
    dismissible = false,
    onDismiss,
    size,
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true)

    const handleDismiss = () => {
      setIsVisible(false)
      onDismiss?.()
    }

    if (!isVisible) return null

    return (
      <div
        ref={ref}
        className={cn(bannerVariants({ variant }), className)}
        {...props}
      >
        <div className={cn(bannerContentVariants({ size }))}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1">
            {title && (
              <h3 className="text-sm font-semibold text-primary-foreground">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-muted-foreground max-w-md">
                {description}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {actionText && (actionHref || onAction) && (
              <Button
                variant="default"
                size="sm"
                onClick={actionHref ? undefined : onAction}
                asChild={!!actionHref}
                className="gap-2"
              >
                {actionHref ? (
                  <a href={actionHref} target="_blank" rel="noopener noreferrer">
                    {actionText}
                    <ExternalLink className="size-3" />
                  </a>
                ) : (
                  <>
                    {actionText}
                  </>
                )}
              </Button>
            )}
            
            {dismissible && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismiss}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              >
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }
)

Banner.displayName = "Banner"

export { Banner, bannerVariants, bannerContentVariants }