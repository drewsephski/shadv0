// Component Insertion Wrapper
// Optional wrapper that enables component insertion functionality

"use client";

import { forwardRef, useMemo } from 'react';
import { LivePreviewIframe } from './LivePreviewIframe';
import { useLivePreview } from '@/hooks/use-live-preview';
import { useComponentLibrary } from '@/hooks/use-component-library';
import {
  ComponentInsertionFeatureConfig,
  defaultComponentInsertionConfig
} from '@/lib/component-insertion-utils';
import { DesignSystemConfig } from '@/app/types';

interface ComponentInsertionWrapperProps {
  // Core LivePreview props
  htmlContent: string;
  cssContent: string;
  jsContent: string;
  designConfig: DesignSystemConfig;
  onElementSelect?: (element: string | null) => void;

  // Component insertion configuration
  componentInsertionConfig?: Partial<ComponentInsertionFeatureConfig>;

  // Component insertion callbacks
  onComponentSelect?: (instanceId: string | null) => void;
  onComponentMove?: (instanceId: string, position: { x: number; y: number }) => void;
  onComponentInsert?: (position: { x: number; y: number }) => void;

  // Other props
  className?: string;
}

export const ComponentInsertionWrapper = forwardRef<
  HTMLIFrameElement,
  ComponentInsertionWrapperProps
>(function ComponentInsertionWrapperComponent({
  componentInsertionConfig = {},
  onComponentSelect,
  onComponentMove,
  onComponentInsert,
  ...iframeProps
}, ref) {
  // Merge with default config
  const config = useMemo(
    () => ({ ...defaultComponentInsertionConfig, ...componentInsertionConfig }),
    [componentInsertionConfig]
  );

  // Get live preview state (always available)
  const { state: livePreviewState, actions: livePreviewActions } = useLivePreview();

  // Always call the hook (React rules), but conditionally use it
  const componentLibrary = useComponentLibrary();

  // Enhanced iframe props for component insertion
  const enhancedProps = useMemo(() => {
    if (!config.enabled) {
      return iframeProps;
    }

    return {
      ...iframeProps,
      onComponentSelect,
      onComponentMove,
      onComponentInsert,
      liveComponents: componentLibrary.liveComponents,
      insertionContext: {
        insertionMode: 'click-insert',
        snapToGrid: config.enableSnapping,
        snapToElements: config.enableSnapping,
        showGuides: config.enableGuides
      }
    };
  }, [config, componentLibrary, iframeProps, onComponentSelect, onComponentMove, onComponentInsert]);

  // Return enhanced iframe if component insertion is enabled
  if (config.enabled && componentLibrary) {
    return (
      <LivePreviewIframe
        ref={ref}
        {...enhancedProps}
      />
    );
  }

  // Return standard iframe if component insertion is disabled
  return (
    <LivePreviewIframe
      ref={ref}
      {...iframeProps}
    />
  );
});

ComponentInsertionWrapper.displayName = 'ComponentInsertionWrapper';

// Hook for using component insertion features
export function useComponentInsertion(
  config: Partial<ComponentInsertionFeatureConfig> = {}
) {
  const fullConfig = useMemo(
    () => ({ ...defaultComponentInsertionConfig, ...config }),
    [config]
  );

  const { state: livePreviewState, actions: livePreviewActions } = useLivePreview();
  const componentLibrary = useComponentLibrary();

  return {
    config: fullConfig,
    livePreviewState,
    livePreviewActions,
    componentLibrary: fullConfig.enabled ? componentLibrary : null,
    isEnabled: fullConfig.enabled
  };
}

// Configuration presets for common use cases
export const componentInsertionPresets = {
  // Minimal setup - just basic insertion
  minimal: {
    enabled: true,
    enableDragDrop: false,
    enableResize: false,
    enableSnapping: false,
    enableGuides: false,
    enableUndoRedo: true,
    enableKeyboardShortcuts: false,
    enableAccessibility: true,
    performanceMode: 'speed' as const
  },

  // Standard setup - balanced features
  standard: {
    enabled: true,
    enableDragDrop: true,
    enableResize: true,
    enableSnapping: true,
    enableGuides: true,
    enableUndoRedo: true,
    enableKeyboardShortcuts: true,
    enableAccessibility: true,
    performanceMode: 'balanced' as const
  },

  // Full setup - all features enabled
  full: {
    enabled: true,
    enableDragDrop: true,
    enableResize: true,
    enableSnapping: true,
    enableGuides: true,
    enableUndoRedo: true,
    enableKeyboardShortcuts: true,
    enableAccessibility: true,
    enablePerformanceMonitoring: true,
    performanceMode: 'quality' as const
  },

  // Performance-focused setup
  performance: {
    enabled: true,
    enableDragDrop: true,
    enableResize: false,
    enableSnapping: false,
    enableGuides: false,
    enableUndoRedo: true,
    enableKeyboardShortcuts: true,
    enableAccessibility: true,
    performanceMode: 'speed' as const,
    maxHistorySize: 25
  },

  // Accessibility-focused setup
  accessibility: {
    enabled: true,
    enableDragDrop: true,
    enableResize: true,
    enableSnapping: true,
    enableGuides: true,
    enableUndoRedo: true,
    enableKeyboardShortcuts: true,
    enableAccessibility: true,
    enablePerformanceMonitoring: false,
    performanceMode: 'quality' as const
  }
};