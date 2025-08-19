import { Sparkles, Code, Palette, Zap, Lightbulb } from "lucide-react";

type WelcomeMessageProps = {
  onSuggestionClick: (prompt: string) => void;
};

export function WelcomeMessage({ onSuggestionClick }: WelcomeMessageProps) {
  const promptSuggestions = [
    {
      icon: <Code className="size-4" />,
      title: "Responsive Navbar",
      description: "Build a modern navigation bar with Tailwind CSS",
      prompt: "Create a responsive navbar with Tailwind CSS that includes a logo, navigation links, and a mobile hamburger menu"
    },
    {
      icon: <Code className="size-4" />,
      title: "Pricing Section",
      description: "Generate a pricing section with toggle",
      prompt: "Design a pricing section with monthly/annual toggle, three pricing tiers, and call-to-action buttons using Tailwind CSS"
    },
    {
      icon: <Palette className="size-4" />,
      title: "Landing Page",
      description: "Design a beautiful landing page",
      prompt: "Create a modern landing page for a coffee shop with hero section, menu, testimonials, and contact information"
    },
    {
      icon: <Zap className="size-4" />,
      title: "Admin Dashboard",
      description: "Build a responsive admin dashboard",
      prompt: "Create a modern admin dashboard with sidebar navigation, charts, data tables, and dark mode toggle using React and Tailwind"
    }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <div className="size-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-4 mx-auto">
          <Sparkles className="size-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Welcome to ShadV0
        </h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
          I&apos;m your AI assistant, ready to help you build beautiful, functional web applications with modern technologies.
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {['React', 'Tailwind', 'Next.js', 'TypeScript'].map((tech, index) => (
          <div key={index} className="flex flex-col items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="size-8 mb-2 flex items-center justify-center text-foreground/80">
              {tech === 'React' && <Code className="size-4" />}
              {tech === 'Tailwind' && <Palette className="size-4" />}
              {tech === 'Next.js' && <Zap className="size-4" />}
              {tech === 'TypeScript' && <Code className="size-4" />}
            </div>
            <p className="text-xs font-medium">{tech}</p>
          </div>
        ))}
      </div>

      <div className="w-full">
        <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-3 flex items-center justify-center">
          <Lightbulb className="size-3 md:size-4 mr-2 text-primary" />
          Try these prompts to get started
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {promptSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick(suggestion.prompt)}
              className="text-left p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <div className="size-8 rounded-md bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                  {suggestion.icon}
                </div>
                <div>
                  <p className="font-medium text-sm">{suggestion.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{suggestion.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
