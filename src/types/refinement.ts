export type RefinementType = 'style' | 'functionality' | 'accessibility' | 'performance' | 'custom';

export type RefinementStatus = 'pending' | 'in-progress' | 'completed' | 'failed';

export interface RefinementRequest {
  id: string;
  type: RefinementType;
  prompt: string;
  originalHtml: string;
  refinedHtml?: string;
  status: RefinementStatus;
  timestamp: Date;
  error?: string;
  model?: string;
}

export interface RefinementHistory {
  requests: RefinementRequest[];
  currentHtml: string;
}

export interface RefinementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (type: RefinementType, prompt: string) => void;
  isLoading?: boolean;
}

export interface RefinementControlsProps {
  onRefinementRequest: (type: RefinementType, prompt?: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export interface RefinementHistoryProps {
  history: RefinementRequest[];
  onRevert: (refinementId: string) => void;
  onClear: () => void;
}