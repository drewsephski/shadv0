import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Palette,
  Code,
  Accessibility,
  Zap,
  Plus,
  Loader2
} from 'lucide-react';
import { RefinementType, RefinementModalProps } from '@/types/refinement';
import { cn } from '@/lib/utils';

const refinementTypeConfig = {
  style: {
    icon: Palette,
    label: 'Style Refinement',
    description: 'Improve visual design, colors, typography, spacing, and overall aesthetics',
    placeholder: 'Describe the visual improvements you want (e.g., "make it more modern with a dark theme", "improve the color scheme", "enhance typography")',
    color: 'bg-blue-500/10 text-blue-600'
  },
  functionality: {
    icon: Code,
    label: 'Functionality Refinement',
    description: 'Add new features, improve interactions, or enhance user experience',
    placeholder: 'Describe the functionality you want to add or improve (e.g., "add a contact form", "implement smooth animations", "add search functionality")',
    color: 'bg-green-500/10 text-green-600'
  },
  accessibility: {
    icon: Accessibility,
    label: 'Accessibility Refinement',
    description: 'Enhance accessibility, screen reader support, keyboard navigation, and usability',
    placeholder: 'Describe accessibility improvements needed (e.g., "add proper ARIA labels", "improve keyboard navigation", "enhance color contrast")',
    color: 'bg-purple-500/10 text-purple-600'
  },
  performance: {
    icon: Zap,
    label: 'Performance Refinement',
    description: 'Optimize loading times, reduce bundle size, and improve overall performance',
    placeholder: 'Describe performance optimizations needed (e.g., "optimize images", "lazy load components", "reduce JavaScript bundle size")',
    color: 'bg-orange-500/10 text-orange-600'
  },
  custom: {
    icon: Plus,
    label: 'Custom Refinement',
    description: 'Specify any other type of refinement or improvement you need',
    placeholder: 'Describe your specific refinement request in detail...',
    color: 'bg-gray-500/10 text-gray-600'
  }
};

export function RefinementModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false
}: RefinementModalProps) {
  const [selectedType, setSelectedType] = useState<RefinementType>('style');
  const [prompt, setPrompt] = useState('');

  const config = refinementTypeConfig[selectedType];
  const Icon = config.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    onSubmit(selectedType, prompt.trim());
    setPrompt('');
  };

  const handleClose = () => {
    setPrompt('');
    setSelectedType('style');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon className="size-5" />
              Refine Your Content
            </DialogTitle>
            <DialogDescription>
              Select a refinement type and describe what improvements you'd like to make.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Refinement Type Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Refinement Type</Label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(refinementTypeConfig).map(([type, config]) => {
                  const Icon = config.icon;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSelectedType(type as RefinementType)}
                      className={cn(
                        'p-3 rounded-lg border-2 text-left transition-all duration-200',
                        'hover:scale-105 active:scale-95',
                        selectedType === type
                          ? 'border-primary bg-primary/5'
                          : 'border-muted hover:border-primary/50'
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="size-4" />
                        <span className="font-medium text-sm">{config.label}</span>
                        {selectedType === type && (
                          <Badge variant="default" className="ml-auto text-xs">
                            Selected
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {config.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Type Details */}
            <div className={cn('p-4 rounded-lg border', config.color)}>
              <div className="flex items-center gap-2 mb-2">
                <Icon className="size-4" />
                <h3 className="font-medium text-sm">{config.label}</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                {config.description}
              </p>
            </div>

            {/* Refinement Prompt Input */}
            <div className="space-y-3">
              <Label htmlFor="refinement-prompt" className="text-sm font-medium">
                Describe Your Refinement
              </Label>
              <Textarea
                id="refinement-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={config.placeholder}
                className="min-h-[120px] resize-none"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Be specific about what you want to change or improve. More detailed descriptions lead to better results.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="min-w-[100px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Refining...
                </>
              ) : (
                <>
                  <Icon className="size-4 mr-2" />
                  Refine
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}