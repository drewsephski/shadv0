'use client'

import { SplineScene } from './splite'
import { Card } from './card'
import { Spotlight } from './spotlight'
 
export function SplineSceneBasic() {
  return (
    <Card className="w-full h-[500px] bg-black/20 backdrop-blur-sm relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        size={200}
        springOptions={{ bounce: 0 }}
        fill="from-blue-500/70 via-blue-300/70 to-blue-500/70"
      />
      
      <div className="flex h-full">
        {/* Left content */}
        <div className="flex-1 pl-12 pr-8 py-8 relative z-10 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 ml-16">
            AI Code Generation
          </h1>
          <p className="mt-4 text-neutral-300 max-w-lg ml-16">
            Transform ideas into code with AI-powered development. Generate applications,
            components, and features using natural language descriptions.
          </p>
        </div>

        {/* Right content */}
        <div className="flex-1 relative">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  )
}