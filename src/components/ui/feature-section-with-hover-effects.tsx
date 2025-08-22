import React from "react";
import {
  IconAdjustmentsBolt,
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHeart,
  IconHelp,
  IconRouteAltLeft,
  IconTerminal2,
} from "@tabler/icons-react";

export function FeaturesSectionWithHoverEffects() {
  const features = [
    {
      title: "AI-Powered Development",
      description: "Transform ideas into functional apps using advanced AI technology.",
      icon: <IconTerminal2 className="w-6 h-6 text-primary" />,
    },
    {
      title: "Intuitive Interface",
      description: "Simple design that makes app development accessible to everyone.",
      icon: <IconEaseInOut className="w-6 h-6 text-primary" />,
    },
    {
      title: "No Coding Required",
      description: "Build complex applications without writing a single line of code.",
      icon: <IconCurrencyDollar className="w-6 h-6 text-primary" />,
    },
    {
      title: "Real-time Preview",
      description: "See your app come to life instantly with live preview.",
      icon: <IconCloud className="w-6 h-6 text-primary" />,
    },
    {
      title: "Instant Deployment",
      description: "Deploy your applications with one click to the web.",
      icon: <IconRouteAltLeft className="w-6 h-6 text-primary" />,
    },
    {
      title: "Smart AI Assistant",
      description: "Get intelligent suggestions throughout your development process.",
      icon: <IconHelp className="w-6 h-6 text-primary" />,
    },
    {
      title: "Modern Tech Stack",
      description: "Built with latest technologies for optimal performance.",
      icon: <IconAdjustmentsBolt className="w-6 h-6 text-primary" />,
    },
    {
      title: "Community Support",
      description: "Join a vibrant community of developers building together.",
      icon: <IconHeart className="w-6 h-6 text-primary" />,
    },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div className="group/feature relative p-6 rounded-lg border border-border-/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-200">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold mb-2 text-foreground group-hover/feature:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};