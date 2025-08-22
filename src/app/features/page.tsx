"use client";

import { Header } from "@/components/app/layout/Header";
import { FeaturesSectionWithHoverEffects } from "@/components/ui/feature-section-with-hover-effects";
import { SplineSceneBasic } from "@/components/ui/spline-demo";
import { Sparkles } from "lucide-react";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <div className="flex-1">
        <main className="w-full">
          {/* Hero Section */}
          <div className="text-left mb-12 px-4 md:px-8 lg:px-16 max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium my-6 ml-16">
              <Sparkles className="w-4 h-4" />
              AI-Powered Development
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground/70 bg-clip-text text-transparent ml-16">
              Build Apps with AI
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed ml-16">
              Transform your ideas into fully functional applications using natural language.
              Our AI understands your vision and generates production-ready code for you.
            </p>
          </div>

          {/* Features Grid */}
          <div className="mb-12">
            <FeaturesSectionWithHoverEffects />
          </div>
          <div className="mb-8">
            <SplineSceneBasic />
          </div>
        </main>
      </div>
    </div>
  );
}
