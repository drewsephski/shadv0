import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Palette,
  Code,
  Accessibility,
  Zap,
  Plus,
  Loader2
} from 'lucide-react';
import { RefinementType } from '@/types/refinement';
import { cn } from '@/lib/utils';

interface RefinementTypeButtonProps {
  type: RefinementType;
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

const refinementTypeConfig = {
  style: {
    icon: Palette,
    label: 'Style',
    description: 'Improve visual design and styling',
    color: 'bg-blue-500/10 text-blue-600 border-blue-200 hover:bg-blue-500/20',
    badgeColor: 'bg-blue-100 text-blue-700'
  },
  functionality: {
    icon: Code,
    label: 'Functionality',
    description: 'Add or improve interactive features',
    color: 'bg-green-500/10 text-green-600 border-green-200 hover:bg-green-500/20',
    badgeColor: 'bg-green-100 text-green-700'
  },
  accessibility: {
    icon: Accessibility,
    label: 'Accessibility',
    description: 'Enhance accessibility and usability',
    color: 'bg-purple-500/10 text-purple-600 border-purple-200 hover:bg-purple-500/20',
    badgeColor: 'bg-purple-100 text-purple-700'
  },
  performance: {
    icon: Zap,
    label: 'Performance',
    description: 'Optimize loading and performance',
    color: 'bg-orange-500/10 text-orange-600 border-orange-200 hover:bg-orange-500/20',
    badgeColor: 'bg-orange-100 text-orange-700'
  },
  custom: {
    icon: Plus,
    label: 'Custom',
    description: 'Custom refinement request',
    color: 'bg-gray-500/10 text-gray-600 border-gray-200 hover:bg-gray-500/20',
    badgeColor: 'bg-gray-100 text-gray-700'
  }
};

export function RefinementTypeButton({
  type,
  onClick,
  isLoading = false,
  disabled = false,
  className
}: RefinementTypeButtonProps) {
  const config = refinementTypeConfig[type];
  const Icon = config.icon;

  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      variant="outline"
      size="sm"
      className={cn(
        'h-auto p-3 flex flex-col items-center gap-2 transition-all duration-200',
        'hover:scale-105 active:scale-95',
        config.color,
        disabled && 'opacity-50 cursor-not-allowed',
        isLoading && 'animate-pulse',
        className
      )}
    >
      <div className="flex items-center gap-2">
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Icon className="size-4" />
        )}
        <span className="font-medium text-sm">{config.label}</span>
      </div>
      <Badge
        variant="secondary"
        className={cn(
          'text-xs px-2 py-0.5',
          config.badgeColor
        )}
      >
        {config.description}
      </Badge>
    </Button>
  );
}