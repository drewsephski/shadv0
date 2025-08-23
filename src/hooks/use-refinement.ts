import { useState, useCallback } from 'react';
import { RefinementRequest, RefinementType, RefinementStatus } from '@/types/refinement';

export const useRefinement = () => {
  const [refinementHistory, setRefinementHistory] = useState<RefinementRequest[]>([]);
  const [isRefining, setIsRefining] = useState(false);
  const [currentRefinement, setCurrentRefinement] = useState<RefinementRequest | null>(null);

  const createRefinementRequest = useCallback((
    type: RefinementType,
    prompt: string,
    originalHtml: string,
    model?: string
  ): RefinementRequest => {
    return {
      id: Date.now().toString(),
      type,
      prompt,
      originalHtml,
      status: 'pending',
      timestamp: new Date(),
      model,
    };
  }, []);

  const addRefinementRequest = useCallback((request: RefinementRequest) => {
    setRefinementHistory(prev => [...prev, request]);
    setCurrentRefinement(request);
    setIsRefining(true);
  }, []);

  const updateRefinementStatus = useCallback((
    id: string,
    status: RefinementStatus,
    refinedHtml?: string,
    error?: string
  ) => {
    setRefinementHistory(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status, refinedHtml, error }
          : item
      )
    );

    if (status === 'completed' || status === 'failed') {
      setIsRefining(false);
      if (currentRefinement?.id === id) {
        setCurrentRefinement(null);
      }
    }
  }, [currentRefinement]);

  const revertRefinement = useCallback((refinementId: string) => {
    const refinement = refinementHistory.find(r => r.id === refinementId);
    if (refinement && refinement.status === 'completed') {
      // Find the previous state before this refinement
      const refinementIndex = refinementHistory.findIndex(r => r.id === refinementId);
      const previousRefinements = refinementHistory.slice(0, refinementIndex);
      const previousCompletedRefinement = [...previousRefinements].reverse().find(r => r.status === 'completed');

      // Create a revert refinement request
      const revertRequest: RefinementRequest = {
        id: Date.now().toString(),
        type: 'custom',
        prompt: `Reverting to state before: ${refinement.prompt}`,
        originalHtml: refinement.refinedHtml || '',
        status: 'completed',
        timestamp: new Date(),
        refinedHtml: previousCompletedRefinement?.refinedHtml || refinement.originalHtml,
      };

      setRefinementHistory(prev => [...prev, revertRequest]);
    }
  }, [refinementHistory]);

  const clearHistory = useCallback(() => {
    setRefinementHistory([]);
    setCurrentRefinement(null);
    setIsRefining(false);
  }, []);

  const getRefinedHtml = useCallback((originalHtml: string): string => {
    const completedRefinements = refinementHistory
      .filter(r => r.status === 'completed' && r.refinedHtml)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return completedRefinements[0]?.refinedHtml || originalHtml;
  }, [refinementHistory]);

  const getRefinementStats = useCallback(() => {
    const total = refinementHistory.length;
    const completed = refinementHistory.filter(r => r.status === 'completed').length;
    const failed = refinementHistory.filter(r => r.status === 'failed').length;
    const pending = refinementHistory.filter(r => r.status === 'pending' || r.status === 'in-progress').length;

    return { total, completed, failed, pending };
  }, [refinementHistory]);

  return {
    refinementHistory,
    isRefining,
    currentRefinement,
    addRefinementRequest,
    updateRefinementStatus,
    revertRefinement,
    clearHistory,
    getRefinedHtml,
    getRefinementStats,
    createRefinementRequest,
  };
};