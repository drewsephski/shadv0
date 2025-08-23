"use client"

import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ArrowLeft, ArrowRight, Play, Pause, ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
  autoPlay?: boolean
  autoPlayInterval?: number
  showDots?: boolean
  showPlayPause?: boolean
  pauseOnHover?: boolean
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  autoPlay = false,
  autoPlayInterval = 4000,
  showDots = false,
  showPlayPause = false,
  pauseOnHover = true,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins
  )
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([])
  const [isPlaying, setIsPlaying] = React.useState(autoPlay)
  const [isHovered, setIsHovered] = React.useState(false)
  const autoPlayRef = React.useRef<NodeJS.Timeout | null>(null)

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
    setSelectedIndex(api.selectedScrollSnap())
  }, [])

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  const scrollTo = React.useCallback((index: number) => {
    api?.scrollTo(index)
  }, [api])

  const toggleAutoPlay = React.useCallback(() => {
    setIsPlaying(prev => !prev)
  }, [])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        scrollNext()
      } else if (event.key === "Home") {
        event.preventDefault()
        scrollTo(0)
      } else if (event.key === "End") {
        event.preventDefault()
        scrollTo(scrollSnaps.length - 1)
      }
    },
    [scrollPrev, scrollNext, scrollTo, scrollSnaps.length]
  )

  // Auto-play functionality
  React.useEffect(() => {
    if (!api || !autoPlay) return

    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        if (isPlaying && !isHovered && api.canScrollNext()) {
          api.scrollNext()
        } else if (isPlaying && !isHovered && !api.canScrollNext()) {
          api.scrollTo(0) // Loop back to start
        }
      }, autoPlayInterval)
    }

    const stopAutoPlay = () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }

    startAutoPlay()
    return stopAutoPlay
  }, [api, autoPlay, autoPlayInterval, isPlaying, isHovered])

  React.useEffect(() => {
    if (!api || !setApi) return
    setApi(api)
  }, [api, setApi])

  React.useEffect(() => {
    if (!api) return
    setScrollSnaps(api.scrollSnapList())
    onSelect(api)
    api.on("reInit", onSelect)
    api.on("select", onSelect)

    return () => {
      api?.off("select", onSelect)
    }
  }, [api, onSelect])

  const handleMouseEnter = React.useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = React.useCallback(() => {
    setIsHovered(false)
  }, [])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        onMouseEnter={pauseOnHover ? handleMouseEnter : undefined}
        onMouseLeave={pauseOnHover ? handleMouseLeave : undefined}
        className={cn("relative group", className)}
        role="region"
        aria-roledescription="carousel"
        aria-label="Image carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
        {showDots && scrollSnaps.length > 1 && (
          <CarouselDots
            scrollSnaps={scrollSnaps}
            selectedIndex={selectedIndex}
            onDotClick={scrollTo}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
          />
        )}
        {showPlayPause && autoPlay && (
          <CarouselPlayPause
            isPlaying={isPlaying}
            onToggle={toggleAutoPlay}
            className="absolute top-4 right-4"
          />
        )}
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden"
      data-slot="carousel-content"
    >
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = useCarousel()

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
}

function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        "absolute size-8 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -left-12 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
}

function CarouselNext({
  className,
  variant = "outline",
  size = "icon",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        "absolute size-8 rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -right-12 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight />
      <span className="sr-only">Next slide</span>
    </Button>
  )
}

function CarouselDots({
  scrollSnaps,
  selectedIndex,
  onDotClick,
  className,
  ...props
}: {
  scrollSnaps: number[]
  selectedIndex: number
  onDotClick: (index: number) => void
} & React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex space-x-2", className)}
      role="tablist"
      aria-label="Carousel navigation"
      {...props}
    >
      {scrollSnaps.map((_, index) => (
        <button
          key={index}
          type="button"
          role="tab"
          aria-selected={selectedIndex === index}
          aria-label={`Go to slide ${index + 1}`}
          className={cn(
            "w-2 h-2 rounded-full transition-all duration-200",
            selectedIndex === index
              ? "bg-white shadow-lg scale-125"
              : "bg-white/50 hover:bg-white/75"
          )}
          onClick={() => onDotClick(index)}
        />
      ))}
    </div>
  )
}

function CarouselPlayPause({
  isPlaying,
  onToggle,
  className,
  ...props
}: {
  isPlaying: boolean
  onToggle: () => void
} & React.ComponentProps<"button">) {
  return (
    <Button
      variant="secondary"
      size="sm"
      className={cn(
        "bg-black/20 hover:bg-black/30 text-white border-white/20 border-[1px] border-solid backdrop-blur-sm",
        className
      )}
      onClick={onToggle}
      aria-label={isPlaying ? "Pause carousel" : "Play carousel"}
      {...props}
    >
      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
    </Button>
  )
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
  CarouselPlayPause,
}
