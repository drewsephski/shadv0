import React, { JSX } from 'react';
import { Sparkles, Code, Palette, Zap, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";

interface EmptyStateProps {
  onSuggestionClick: (prompt: string) => void;
  suggestions: {
    icon: JSX.Element;
    title: string;
    description: string;
    prompt: string;
  }[];
}

export function EmptyState({ onSuggestionClick, suggestions }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-end h-full pb-4 px-4">
      <div className="w-full max-w-3xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="size-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-4 mx-auto">
            <Sparkles className="size-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            What can we build together?
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
            Describe your idea and I&apos;ll help you create beautiful, functional web applications with modern technologies.
          </p>
        </div>
        
        {/* Feature Highlights */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="flex flex-col items-center p-2 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors">
            <Code className="size-4 md:size-5 text-primary mb-1" />
            <h3 className="font-medium text-xs md:text-sm">React</h3>
          </div>
          
          <div className="flex flex-col items-center p-2 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors">
            <Palette className="size-4 md:size-5 text-primary mb-1" />
            <h3 className="font-medium text-xs md:text-sm">Tailwind</h3>
          </div>
          
          <div className="flex flex-col items-center p-2 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors">
            <Zap className="size-4 md:size-5 text-primary mb-1" />
            <h3 className="font-medium text-xs md:text-sm">Fast</h3>
          </div>
        </div>

        {/* Prompt Suggestions */}
        <div className="w-full">
          <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-3 flex items-center justify-center">
            <Lightbulb className="size-3 md:size-4 mr-2 text-primary" />
            Try these prompts to get started
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            {suggestions.slice(0, 4).map((suggestion, index) => (
              <Card
                key={index}
                className="p-4 hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => onSuggestionClick(suggestion.prompt)}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    {React.cloneElement(suggestion.icon, { className: 'size-5 text-primary' })}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{suggestion.title}</p>
                    <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
