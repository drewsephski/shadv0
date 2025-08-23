"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { ColorPalette, DesignSystemConfig } from '@/app/types';
import { componentInsertionEngine, componentInsertionUtils } from '@/lib/component-insertion-utils';
import {
  ComponentInsertionOptions,
  ComponentValidationResult,
  LivePreviewComponent,
  ComponentInsertionHistory,
  ComponentInsertionContext,
  ComponentInsertionMetrics
} from '@/types/component-library';

export interface LivePreviewState {
  htmlContent: string;
  cssContent: string;
  jsContent: string;
  designConfig: DesignSystemConfig;
  isEditing: boolean;
  activeView: 'code' | 'preview' | 'split';
  selectedElement: string | null;
  isDirty: boolean;
  // Component insertion state
  liveComponents: Map<string, import('@/types/component-library').LivePreviewComponent>;
  insertionHistory: import('@/types/component-library').ComponentInsertionHistory[];
  historyIndex: number;
  insertionContext: import('@/types/component-library').ComponentInsertionContext;
  insertionMetrics: import('@/types/component-library').ComponentInsertionMetrics;
  componentGroups: Map<string, string[]>; // groupId -> componentIds
}

export interface LivePreviewActions {
  updateHTML: (html: string) => void;
  updateCSS: (css: string) => void;
  updateJS: (js: string) => void;
  updateDesignConfig: (config: DesignSystemConfig) => void;
  setActiveView: (view: LivePreviewState['activeView']) => void;
  setSelectedElement: (element: string | null) => void;
  setEditing: (editing: boolean) => void;
  markDirty: (dirty: boolean) => void;
  reset: () => void;
  applyDesignChange: (property: string, value: string) => void;
  injectCSSVariables: () => string;
  syncChanges: () => Promise<void>;
  // Component insertion methods
  insertComponent: (options: import('@/types/component-library').ComponentInsertionOptions) => Promise<string>;
  removeComponent: (instanceId: string) => Promise<void>;
  updateComponent: (instanceId: string, updates: Partial<import('@/types/component-library').LivePreviewComponent>) => Promise<void>;
  moveComponent: (instanceId: string, position: { x: number; y: number }) => Promise<void>;
  duplicateComponent: (instanceId: string) => Promise<string>;
  undoComponentAction: () => Promise<void>;
  redoComponentAction: () => Promise<void>;
  getComponentAtPosition: (x: number, y: number) => string | null;
  getComponentsInArea: (startX: number, startY: number, endX: number, endY: number) => string[];
  groupComponents: (instanceIds: string[], groupId?: string) => Promise<string>;
  ungroupComponents: (groupId: string) => Promise<void>;
  validateComponentInsertion: (options: import('@/types/component-library').ComponentInsertionOptions) => Promise<import('@/types/component-library').ComponentValidationResult>;
  getInsertionHistory: () => import('@/types/component-library').ComponentInsertionHistory[];
  clearInsertionHistory: () => void;
  setInsertionContext: (context: import('@/types/component-library').ComponentInsertionContext) => void;
  getInsertionMetrics: () => import('@/types/component-library').ComponentInsertionMetrics;
}

export function useLivePreview(initialHTML = '', initialDesignConfig?: DesignSystemConfig) {
  const [state, setState] = useState<LivePreviewState>({
    htmlContent: initialHTML,
    cssContent: '',
    jsContent: '',
    designConfig: initialDesignConfig || {
      mode: 'light',
      colors: {
        primary: '#3B82F6',
        secondary: '#1E40AF',
        accent: '#06B6D4',
        background: '#FFFFFF',
        surface: '#F8FAFC',
        text: '#1E293B',
        textSecondary: '#64748B',
        border: '#E2E8F0',
        error: '#EF4444',
        success: '#10B981',
        warning: '#F59E0B'
      },
      typography: {
        fontFamily: 'inter',
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem'
        },
        fontWeight: {
          light: 300,
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700
        },
        lineHeight: {
          tight: 1.25,
          normal: 1.5,
          relaxed: 1.75
        }
      },
      components: {
        button: 'rounded',
        input: 'default',
        card: 'elevated',
        modal: 'default'
      },
      spacing: {
        spacing: {
          xs: '0.25rem',
          sm: '0.5rem',
          md: '1rem',
          lg: '1.5rem',
          xl: '2rem',
          '2xl': '3rem'
        },
        borderRadius: {
          sm: '0.125rem',
          md: '0.375rem',
          lg: '0.5rem',
          xl: '0.75rem',
          full: '9999px'
        }
      },
      animations: {
        enabled: true,
        duration: 'normal',
        easing: 'ease'
      }
    },
    isEditing: false,
    activeView: 'split',
    selectedElement: null,
    isDirty: false,
    // Component insertion state
    liveComponents: new Map(),
    insertionHistory: [],
    historyIndex: -1,
    insertionContext: {
      insertionMode: 'click-insert',
      snapToGrid: false,
      snapToElements: false,
      showGuides: false
    },
    insertionMetrics: {
      loadTime: 0,
      renderTime: 0,
      memoryUsage: 0,
      componentCount: 0,
      errorCount: 0,
      warningCount: 0
    },
    componentGroups: new Map()
  });

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  // Generate CSS variables from design config
  const injectCSSVariables = useCallback(() => {
    const { designConfig } = state;
    const cssVars: Record<string, string> = {};

    // Color variables
    Object.entries(designConfig.colors).forEach(([key, value]) => {
      cssVars[`--color-${key}`] = value;
    });

    // Typography variables
    cssVars['--font-family-primary'] = designConfig.typography.fontFamily;
    Object.entries(designConfig.typography.fontSize).forEach(([key, value]) => {
      cssVars[`--font-size-${key}`] = value;
    });
    Object.entries(designConfig.typography.fontWeight).forEach(([key, value]) => {
      cssVars[`--font-weight-${key}`] = value.toString();
    });
    Object.entries(designConfig.typography.lineHeight).forEach(([key, value]) => {
      cssVars[`--line-height-${key}`] = value.toString();
    });

    // Spacing variables
    Object.entries(designConfig.spacing.spacing).forEach(([key, value]) => {
      cssVars[`--spacing-${key}`] = value;
    });
    Object.entries(designConfig.spacing.borderRadius).forEach(([key, value]) => {
      cssVars[`--border-radius-${key}`] = value;
    });

    // Generate CSS string
    const cssString = `
      :root {
        ${Object.entries(cssVars)
          .map(([key, value]) => `${key}: ${value};`)
          .join('\n        ')}
      }

      body {
        font-family: var(--font-family-primary), system-ui, -apple-system, sans-serif;
        background-color: var(--color-background);
        color: var(--color-text);
        margin: 0;
        padding: var(--spacing-md);
      }
    `;

    return cssString;
  }, [state.designConfig]);

  // Apply design changes to iframe
  const applyDesignToIframe = useCallback(() => {
    if (!iframeRef.current) return;

    try {
      const iframeDoc = iframeRef.current.contentDocument;
      if (!iframeDoc) return;

      // Remove existing style tag
      const existingStyle = iframeDoc.getElementById('live-preview-styles');
      if (existingStyle) {
        existingStyle.remove();
      }

      // Add new style tag with CSS variables
      const styleTag = iframeDoc.createElement('style');
      styleTag.id = 'live-preview-styles';
      styleTag.textContent = injectCSSVariables();
      iframeDoc.head.appendChild(styleTag);

    } catch (error) {
      console.error('Failed to apply design to iframe:', error);
    }
  }, [injectCSSVariables]);

  // Sync changes between code and preview
  const syncChanges = useCallback(async () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      applyDesignToIframe();
      setState(prev => ({ ...prev, isDirty: false }));
    }, 300);
  }, [applyDesignToIframe]);

  // Actions
  const updateHTML = useCallback((html: string) => {
    setState(prev => ({ ...prev, htmlContent: html, isDirty: true }));
    syncChanges();
  }, [syncChanges]);

  const updateCSS = useCallback((css: string) => {
    setState(prev => ({ ...prev, cssContent: css, isDirty: true }));
    syncChanges();
  }, [syncChanges]);

  const updateJS = useCallback((js: string) => {
    setState(prev => ({ ...prev, jsContent: js, isDirty: true }));
    syncChanges();
  }, [syncChanges]);

  const updateDesignConfig = useCallback((config: DesignSystemConfig) => {
    setState(prev => ({ ...prev, designConfig: config, isDirty: true }));
    syncChanges();
  }, [syncChanges]);

  const setActiveView = useCallback((view: LivePreviewState['activeView']) => {
    setState(prev => ({ ...prev, activeView: view }));
  }, []);

  const setSelectedElement = useCallback((element: string | null) => {
    setState(prev => ({ ...prev, selectedElement: element }));
  }, []);

  const setEditing = useCallback((editing: boolean) => {
    setState(prev => ({ ...prev, isEditing: editing }));
  }, []);

  const markDirty = useCallback((dirty: boolean) => {
    setState(prev => ({ ...prev, isDirty: dirty }));
  }, []);

  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      htmlContent: initialHTML,
      cssContent: '',
      jsContent: '',
      isDirty: false,
      selectedElement: null
    }));
    syncChanges();
  }, [initialHTML, syncChanges]);

  const applyDesignChange = useCallback((property: string, value: string) => {
    setState(prev => {
      const newConfig = { ...prev.designConfig };

      // Handle nested properties
      if (property.startsWith('colors.')) {
        const colorKey = property.split('.')[1] as keyof ColorPalette;
        newConfig.colors = { ...newConfig.colors, [colorKey]: value };
      } else if (property.startsWith('typography.')) {
        const [, type, key] = property.split('.');
        if (type === 'fontFamily') {
          newConfig.typography = { ...newConfig.typography, fontFamily: value as TypographyConfig['fontFamily'] };
        } else if (type === 'fontSize') {
          newConfig.typography.fontSize = { ...newConfig.typography.fontSize, [key]: value };
        } else if (type === 'fontWeight') {
          newConfig.typography.fontWeight = { ...newConfig.typography.fontWeight, [key]: parseInt(value) };
        } else if (type === 'lineHeight') {
          newConfig.typography.lineHeight = { ...newConfig.typography.lineHeight, [key]: parseFloat(value) };
        }
      } else if (property.startsWith('spacing.')) {
        const [, type, key] = property.split('.');
        if (type === 'spacing') {
          newConfig.spacing.spacing = { ...newConfig.spacing.spacing, [key]: value };
        } else if (type === 'borderRadius') {
          newConfig.spacing.borderRadius = { ...newConfig.spacing.borderRadius, [key]: value };
        }
      } else if (property.startsWith('components.')) {
        const [, , key] = property.split('.');
        (newConfig.components as Record<string, string>)[key] = value;
      }

      return { ...prev, designConfig: newConfig, isDirty: true };
    });
    syncChanges();
  }, [syncChanges]);

  // Apply design changes when iframe loads
  useEffect(() => {
    if (iframeRef.current) {
      const handleLoad = () => {
        applyDesignToIframe();
      };

      iframeRef.current.addEventListener('load', handleLoad);

      return () => {
        iframeRef.current?.removeEventListener('load', handleLoad);
      };
    }
  }, [applyDesignToIframe]);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const actions: LivePreviewActions = {
    updateHTML,
    updateCSS,
    updateJS,
    updateDesignConfig,
    setActiveView,
    setSelectedElement,
    setEditing,
    markDirty,
    reset,
    applyDesignChange,
    injectCSSVariables,
    syncChanges,
    // Component insertion methods
    insertComponent: useCallback(async (options: ComponentInsertionOptions): Promise<string> => {
      try {
        const { instanceId, code, component } = await componentInsertionEngine.insertComponent(
          options,
          state.designConfig,
          state.liveComponents
        );

        // Add to live components
        setState(prev => ({
          ...prev,
          liveComponents: new Map(prev.liveComponents).set(instanceId, component),
          isDirty: true
        }));

        // Execute insertion code in iframe
        if (state.activeView === 'preview' || state.activeView === 'split') {
          updateJS(code);
        }

        return instanceId;
      } catch (error) {
        console.error('Failed to insert component:', error);
        throw error;
      }
    }, [state.designConfig, state.liveComponents, state.activeView, updateJS]),

    removeComponent: useCallback(async (instanceId: string): Promise<void> => {
      try {
        const removeCode = await componentInsertionEngine.removeComponent(instanceId, state.liveComponents);

        // Remove from live components
        setState(prev => {
          const newComponents = new Map(prev.liveComponents);
          newComponents.delete(instanceId);
          return {
            ...prev,
            liveComponents: newComponents,
            isDirty: true
          };
        });

        // Execute removal code in iframe
        if (state.activeView === 'preview' || state.activeView === 'split') {
          updateJS(removeCode);
        }
      } catch (error) {
        console.error('Failed to remove component:', error);
        throw error;
      }
    }, [state.liveComponents, state.activeView, updateJS]),

    updateComponent: useCallback(async (
      instanceId: string,
      updates: Partial<LivePreviewComponent>
    ): Promise<void> => {
      try {
        const { code, component } = await componentInsertionEngine.updateComponent(
          instanceId,
          updates,
          state.liveComponents,
          state.designConfig
        );

        // Update live components
        setState(prev => ({
          ...prev,
          liveComponents: new Map(prev.liveComponents).set(instanceId, component),
          isDirty: true
        }));

        // Execute update code in iframe
        if (state.activeView === 'preview' || state.activeView === 'split') {
          updateJS(code);
        }
      } catch (error) {
        console.error('Failed to update component:', error);
        throw error;
      }
    }, [state.liveComponents, state.designConfig, state.activeView, updateJS]),

    moveComponent: useCallback(async (
      instanceId: string,
      position: { x: number; y: number }
    ): Promise<void> => {
      const component = state.liveComponents.get(instanceId);
      if (component) {
        const { code, component: updatedComponent } = await componentInsertionEngine.updateComponent(
          instanceId,
          { position },
          state.liveComponents,
          state.designConfig
        );

        setState(prev => ({
          ...prev,
          liveComponents: new Map(prev.liveComponents).set(instanceId, updatedComponent),
          isDirty: true
        }));

        if (state.activeView === 'preview' || state.activeView === 'split') {
          updateJS(code);
        }
      }
    }, [state.liveComponents, state.designConfig, state.activeView, updateJS]),

    duplicateComponent: useCallback(async (instanceId: string): Promise<string> => {
      const component = state.liveComponents.get(instanceId);
      if (!component) {
        throw new Error(`Component ${instanceId} not found`);
      }

      // Create new insertion options based on existing component
      const newOptions: ComponentInsertionOptions = {
        componentId: component.componentId,
        variant: component.variant,
        props: component.props,
        position: 'append',
        insertionPoint: component.position ? {
          x: component.position.x + 20,
          y: component.position.y + 20
        } : undefined
      };

      const { instanceId: newInstanceId, code, component: newComponent } = await componentInsertionEngine.insertComponent(
        newOptions,
        state.designConfig,
        state.liveComponents
      );

      // Add to live components
      setState(prev => ({
        ...prev,
        liveComponents: new Map(prev.liveComponents).set(newInstanceId, newComponent),
        isDirty: true
      }));

      // Execute insertion code in iframe
      if (state.activeView === 'preview' || state.activeView === 'split') {
        updateJS(code);
      }

      return newInstanceId;
    }, [state.liveComponents, state.designConfig, state.activeView, updateJS]),

    undoComponentAction: useCallback(async (): Promise<void> => {
      const action = await componentInsertionEngine.undo();
      if (action) {
        // Handle undo based on action type
        if (action.action === 'insert') {
          const removeCode = await componentInsertionEngine.removeComponent(action.instanceId, state.liveComponents);
          setState(prev => {
            const newComponents = new Map(prev.liveComponents);
            newComponents.delete(action.instanceId);
            return { ...prev, liveComponents: newComponents, isDirty: true };
          });
          if (state.activeView === 'preview' || state.activeView === 'split') {
            updateJS(removeCode);
          }
        } else if (action.action === 'remove') {
          // Re-insert the component
          const component = action.previousState as LivePreviewComponent;
          if (component) {
            const { code, component: newComponent } = await componentInsertionEngine.insertComponent(
              {
                componentId: action.componentId,
                variant: component.variant,
                props: component.props,
                position: 'append',
                insertionPoint: component.position
              },
              state.designConfig,
              state.liveComponents
            );

            setState(prev => ({
              ...prev,
              liveComponents: new Map(prev.liveComponents).set(action.instanceId, newComponent),
              isDirty: true
            }));

            if (state.activeView === 'preview' || state.activeView === 'split') {
              updateJS(code);
            }
          }
        } else if (action.action === 'modify') {
          // Restore previous state
          if (action.previousState) {
            const { code, component } = await componentInsertionEngine.updateComponent(
              action.instanceId,
              action.previousState,
              state.liveComponents,
              state.designConfig
            );

            setState(prev => ({
              ...prev,
              liveComponents: new Map(prev.liveComponents).set(action.instanceId, component),
              isDirty: true
            }));

            if (state.activeView === 'preview' || state.activeView === 'split') {
              updateJS(code);
            }
          }
        }
      }
    }, [state.liveComponents, state.designConfig, state.activeView, updateJS]),

    redoComponentAction: useCallback(async (): Promise<void> => {
      const action = await componentInsertionEngine.redo();
      if (action) {
        // Handle redo based on action type
        if (action.action === 'insert') {
          // Re-insert the component
          const component = action.newState as LivePreviewComponent;
          if (component) {
            const { code, component: newComponent } = await componentInsertionEngine.insertComponent(
              {
                componentId: action.componentId,
                variant: component.variant,
                props: component.props,
                position: 'append',
                insertionPoint: component.position
              },
              state.designConfig,
              state.liveComponents
            );

            setState(prev => ({
              ...prev,
              liveComponents: new Map(prev.liveComponents).set(action.instanceId, newComponent),
              isDirty: true
            }));

            if (state.activeView === 'preview' || state.activeView === 'split') {
              updateJS(code);
            }
          }
        } else if (action.action === 'remove') {
          const removeCode = await componentInsertionEngine.removeComponent(action.instanceId, state.liveComponents);
          setState(prev => {
            const newComponents = new Map(prev.liveComponents);
            newComponents.delete(action.instanceId);
            return { ...prev, liveComponents: newComponents, isDirty: true };
          });
          if (state.activeView === 'preview' || state.activeView === 'split') {
            updateJS(removeCode);
          }
        } else if (action.action === 'modify') {
          // Apply new state
          if (action.newState) {
            const { code, component } = await componentInsertionEngine.updateComponent(
              action.instanceId,
              action.newState,
              state.liveComponents,
              state.designConfig
            );

            setState(prev => ({
              ...prev,
              liveComponents: new Map(prev.liveComponents).set(action.instanceId, component),
              isDirty: true
            }));

            if (state.activeView === 'preview' || state.activeView === 'split') {
              updateJS(code);
            }
          }
        }
      }
    }, [state.liveComponents, state.designConfig, state.activeView, updateJS]),

    getComponentAtPosition: useCallback((x: number, y: number): string | null => {
      return componentInsertionEngine.getComponentAtPosition(x, y, state.liveComponents);
    }, [state.liveComponents]),

    getComponentsInArea: useCallback((
      startX: number,
      startY: number,
      endX: number,
      endY: number
    ): string[] => {
      return componentInsertionEngine.getComponentsInArea(startX, startY, endX, endY, state.liveComponents);
    }, [state.liveComponents]),

    groupComponents: useCallback(async (
      instanceIds: string[],
      groupId?: string
    ): Promise<string> => {
      const finalGroupId = groupId || componentInsertionUtils.generateId('group');
      const updatedComponents = componentInsertionEngine.groupComponents(
        instanceIds,
        finalGroupId,
        state.liveComponents
      );

      setState(prev => ({
        ...prev,
        liveComponents: updatedComponents,
        componentGroups: new Map(prev.componentGroups).set(finalGroupId, instanceIds)
      }));

      return finalGroupId;
    }, [state.liveComponents]),

    ungroupComponents: useCallback(async (groupId: string): Promise<void> => {
      const updatedComponents = componentInsertionEngine.ungroupComponents(groupId, state.liveComponents);

      setState(prev => {
        const newGroups = new Map(prev.componentGroups);
        newGroups.delete(groupId);
        return {
          ...prev,
          liveComponents: updatedComponents,
          componentGroups: newGroups
        };
      });
    }, [state.liveComponents]),

    validateComponentInsertion: useCallback(async (
      options: ComponentInsertionOptions
    ): Promise<ComponentValidationResult> => {
      return await componentInsertionEngine.validateComponentInsertion(options, state.liveComponents);
    }, [state.liveComponents]),

    getInsertionHistory: useCallback((): ComponentInsertionHistory[] => {
      return componentInsertionEngine.getHistory();
    }, []),

    clearInsertionHistory: useCallback((): void => {
      componentInsertionEngine.clearHistory();
      setState(prev => ({ ...prev, insertionHistory: [], historyIndex: -1 }));
    }, []),

    setInsertionContext: useCallback((context: ComponentInsertionContext): void => {
      setState(prev => ({ ...prev, insertionContext: context }));
    }, []),

    getInsertionMetrics: useCallback((): ComponentInsertionMetrics => {
      return {
        ...state.insertionMetrics,
        componentCount: state.liveComponents.size,
        loadTime: performance.now()
      };
    }, [state.insertionMetrics, state.liveComponents.size])
  };

  return {
    state,
    actions,
    iframeRef
  };
}