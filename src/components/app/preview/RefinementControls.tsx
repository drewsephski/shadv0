import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  History,
  ChevronDown,
  ChevronUp,
  X,
  Loader2
} from 'lucide-react';
import { RefinementTypeButton } from './RefinementTypeButton';
import { RefinementHistory } from './RefinementHistory';
import { RefinementModal } from './RefinementModal';
import {
  RefinementType,
  RefinementControlsProps,
  RefinementRequest
} from '@/types/refinement';
import { cn } from '@/lib/utils';

interface ExtendedRefinementControlsProps extends RefinementControlsProps {
  refinementHistory: RefinementRequest[];
  onRevertRefinement: (refinementId: string) => void;
  onClearHistory: () => void;
  className?: string;
}

export function RefinementControls({
  onRefinementRequest,
  isLoading = false,
  disabled = false,
  refinementHistory,
  onRevertRefinement,
  onClearHistory,
  className
}: ExtendedRefinementControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState<RefinementType | null>(null);

  const refinementTypes: RefinementType[] = [
    'style',
    'functionality',
    'accessibility',
    'performance'
  ];

  const handleRefinementTypeClick = (type: RefinementType) => {
    if (type === 'custom') {
      setSelectedType(type);
      setShowModal(true);
    } else {
      onRefinementRequest(type);
    }
  };

  const handleModalSubmit = (type: RefinementType, prompt: string) => {
    onRefinementRequest(type, prompt);
    setShowModal(false);
    setSelectedType(null);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedType(null);
  };

  const pendingRefinements = refinementHistory.filter(r => r.status === 'pending' || r.status === 'in-progress');
  const completedRefinements = refinementHistory.filter(r => r.status === 'completed');

  return (
    <div className={cn('space-y-3', className)}>
      {/* Header with toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">Refine Content</span>
          {pendingRefinements.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              <Loader2 className="size-3 animate-spin mr-1" />
              {pendingRefinements.length} processing
            </Badge>
          )}
          {completedRefinements.length > 0 && (
            <Badge variant="default" className="text-xs bg-green-500">
              {completedRefinements.length} completed
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1">
          {refinementHistory.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="h-8 px-2"
            >
              <History className="size-3 mr-1" />
              History
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 px-2"
          >
            {isExpanded ? (
              <ChevronUp className="size-3" />
            ) : (
              <ChevronDown className="size-3" />
            )}
          </Button>
        </div>
      </div>

      {/* Refinement type buttons */}
      {isExpanded && (
        <Card className="p-4 space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-3">Quick Refinements</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {refinementTypes.map((type) => (
                <RefinementTypeButton
                  key={type}
                  type={type}
                  onClick={() => handleRefinementTypeClick(type)}
                  isLoading={isLoading}
                  disabled={disabled}
                />
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <Button
              onClick={() => handleRefinementTypeClick('custom')}
              disabled={disabled || isLoading}
              variant="outline"
              className="w-full h-auto p-3 flex flex-col items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Settings className="size-4" />
              )}
              <span className="font-medium text-sm">Custom Refinement</span>
              <span className="text-xs text-muted-foreground">
                Specify your own refinement requirements
              </span>
            </Button>
          </div>
        </Card>
      )}

      {/* History panel */}
      {showHistory && refinementHistory.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium">Refinement History</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(false)}
              className="h-6 w-6 p-0"
            >
              <X className="size-3" />
            </Button>
          </div>
          <RefinementHistory
            history={refinementHistory}
            onRevert={onRevertRefinement}
            onClear={onClearHistory}
          />
        </Card>
      )}

      {/* Refinement Modal */}
      <RefinementModal
        isOpen={showModal}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}