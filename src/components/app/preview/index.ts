// Preview Components Index
// Main exports for preview-related components

export { LivePreviewIframe } from './LivePreviewIframe';
export { LivePreviewEditor } from './LivePreviewEditor';
export { DesignControlsPanel } from './DesignControlsPanel';
export { PreviewPanel } from './PreviewPanel';
export { RefinementControls } from './RefinementControls';
export { RefinementHistory } from './RefinementHistory';
export { RefinementModal } from './RefinementModal';
export { RefinementTypeButton } from './RefinementTypeButton';

// Component Insertion Feature (Optional)
export {
  ComponentInsertionWrapper,
  useComponentInsertion,
  componentInsertionPresets
} from './ComponentInsertionWrapper';

export {
  MinimalComponentInsertionExample,
  FullComponentInsertionExample,
  ConditionalComponentInsertionExample,
  ComponentLibraryIntegrationExample,
  KeyboardShortcutIntegrationExample,
  integrationExamples
} from './ComponentInsertionIntegration';

// Re-export utilities for convenience
export { componentInsertionEngine, componentInsertionUtils } from '@/lib/component-insertion-utils';
export { defaultComponentInsertionConfig } from '@/lib/component-insertion-utils';

// Type exports
export type {
  ComponentInsertionConfig as ComponentInsertionFeatureConfig,
  ComponentInsertionOptions,
  ComponentValidationResult,
  LivePreviewComponent,
  ComponentInsertionHistory,
  ComponentInsertionContext,
  ComponentInsertionMetrics
} from '@/types/component-library';