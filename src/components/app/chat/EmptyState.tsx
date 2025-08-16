import { Sparkles, Code, Palette, Zap } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-8 px-6">
      <div className="mb-6">
        <div className="size-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-4 mx-auto">
          <Sparkles className="size-8 text-primary-foreground" />
        </div>
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          What can we build together?
        </h2>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Describe your idea and I&apos;ll help you create beautiful, functional web applications with modern technologies.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto w-full">
        <div className="flex flex-col items-center p-3 rounded-lg bg-accent/20 border border-accent/30">
          <Code className="size-6 text-primary mb-2" />
          <h3 className="font-semibold mb-1 text-sm">React Components</h3>
          <p className="text-xs text-muted-foreground text-center">
            Interactive UI components with modern React patterns
          </p>
        </div>
        
        <div className="flex flex-col items-center p-3 rounded-lg bg-accent/20 border border-accent/30">
          <Palette className="size-6 text-primary mb-2" />
          <h3 className="font-semibold mb-1 text-sm">Beautiful Design</h3>
          <p className="text-xs text-muted-foreground text-center">
            Styled with Tailwind CSS and modern design principles
          </p>
        </div>
        
        <div className="flex flex-col items-center p-3 rounded-lg bg-accent/20 border border-accent/30">
          <Zap className="size-6 text-primary mb-2" />
          <h3 className="font-semibold mb-1 text-sm">Fast & Responsive</h3>
          <p className="text-xs text-muted-foreground text-center">
            Optimized for performance and all device sizes
          </p>
        </div>
      </div>
    </div>
  );
}
