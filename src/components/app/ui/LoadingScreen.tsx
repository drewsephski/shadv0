import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Zap, LayoutTemplate, Sparkles, Code, CheckCircle, Palette } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export type LoadingStage = {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  progress: number;
};

interface LoadingScreenProps {
  currentStage: LoadingStage;
  brandingText?: string;
  onGenerationComplete?: () => void;
}

const loadingStages: LoadingStage[] = [
  { id: 'start', name: 'Initializing Generator', description: 'Warming up AI models...', icon: Sparkles, progress: 5 },
  { id: 'scaffolding', name: 'Scaffolding Project', description: 'Setting up project structure and files...', icon: LayoutTemplate, progress: 20 },
  { id: 'styling', name: 'Applying Styles', description: 'Integrating Tailwind CSS and design tokens...', icon: Palette, progress: 40 },
  { id: 'components', name: 'Wiring Components', description: 'Connecting UI elements and logic...', icon: Code, progress: 60 },
  { id: 'optimization', name: 'Optimizing Performance', description: 'Minifying code and optimizing assets...', icon: Zap, progress: 80 },
  { id: 'finalizing', name: 'Finalizing Build', description: 'Performing final checks and preparing preview...', icon: Loader2, progress: 95 },
  { id: 'complete', name: 'Build Complete', description: 'Your application is ready!', icon: CheckCircle, progress: 100 },
];

export { loadingStages };

export function LoadingScreen({ currentStage, brandingText = "Drew", onGenerationComplete }: LoadingScreenProps) {
  const currentProgress = currentStage.progress;

  React.useEffect(() => {
    if (currentStage.id === 'complete' && onGenerationComplete) {
      onGenerationComplete();
    }
  }, [currentStage, onGenerationComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950 bg-opacity-90 backdrop-blur-md">
      <div className="flex flex-col items-center p-8 rounded-lg max-w-md w-full">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8 text-center"
        >
          <currentStage.icon className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-pulse" />
          <h2 className="text-3xl font-bold text-white mb-2">{currentStage.name}</h2>
          <p className="text-gray-400">{currentStage.description}</p>
        </motion.div>

        <div className="w-full mb-8">
          <Progress value={currentProgress} className="w-full h-2 bg-gray-700" />
          <p className="text-right text-sm text-gray-400 mt-2">{currentProgress}%</p>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">Powered by {brandingText}</p>
        </div>
      </div>
    </div>
  );
}