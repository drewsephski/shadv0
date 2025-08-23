import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  History,
  RotateCcw,
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { RefinementRequest, RefinementHistoryProps } from '@/types/refinement';
import { cn } from '@/lib/utils';

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'text-yellow-600 bg-yellow-100',
    label: 'Pending'
  },
  'in-progress': {
    icon: Loader2,
    color: 'text-blue-600 bg-blue-100',
    label: 'In Progress'
  },
  completed: {
    icon: CheckCircle,
    color: 'text-green-600 bg-green-100',
    label: 'Completed'
  },
  failed: {
    icon: XCircle,
    color: 'text-red-600 bg-red-100',
    label: 'Failed'
  }
};

const typeConfig = {
  style: { color: 'bg-blue-500/10 text-blue-600' },
  functionality: { color: 'bg-green-500/10 text-green-600' },
  accessibility: { color: 'bg-purple-500/10 text-purple-600' },
  performance: { color: 'bg-orange-500/10 text-orange-600' },
  custom: { color: 'bg-gray-500/10 text-gray-600' }
};

export function RefinementHistory({
  history,
  onRevert,
  onClear
}: RefinementHistoryProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <History className="size-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No refinement history yet</p>
        <p className="text-xs">Your refinement requests will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Recent Refinements</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-3 mr-1" />
          Clear All
        </Button>
      </div>

      <ScrollArea className="max-h-64">
        <div className="space-y-3">
          {history.slice().reverse().map((item, index) => {
            const StatusIcon = statusConfig[item.status].icon;
            const isExpanded = expandedItems.has(item.id);
            const canRevert = item.status === 'completed' && item.refinedHtml;

            return (
              <div key={item.id} className="space-y-2">
                {/* Refinement Item */}
                <div className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                  {/* Status Icon */}
                  <div className={cn(
                    'flex-shrink-0 p-1.5 rounded-full',
                    statusConfig[item.status].color
                  )}>
                    <StatusIcon className={cn(
                      'size-3',
                      item.status === 'in-progress' && 'animate-spin'
                    )} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-xs px-2 py-0.5',
                          typeConfig[item.type].color
                        )}
                      >
                        {item.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(item.timestamp)}
                      </span>
                      {item.model && (
                        <Badge variant="outline" className="text-xs">
                          {item.model}
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm font-medium mb-1">
                      {isExpanded ? item.prompt : truncateText(item.prompt, 80)}
                    </p>

                    {item.error && (
                      <div className="flex items-center gap-1 text-xs text-destructive mb-1">
                        <AlertCircle className="size-3" />
                        <span>{item.error}</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {canRevert && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRevert(item.id)}
                          className="h-6 px-2 text-xs"
                        >
                          <RotateCcw className="size-3 mr-1" />
                          Revert
                        </Button>
                      )}

                      {item.prompt.length > 80 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpanded(item.id)}
                          className="h-6 px-2 text-xs"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="size-3 mr-1" />
                              Less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="size-3 mr-1" />
                              More
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Separator (except for last item) */}
                {index < history.length - 1 && (
                  <Separator className="my-2" />
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Summary Stats */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
        <span>{history.length} total refinements</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            {history.filter(h => h.status === 'completed').length} completed
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            {history.filter(h => h.status === 'failed').length} failed
          </span>
        </div>
      </div>
    </div>
  );
}