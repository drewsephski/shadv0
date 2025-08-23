// Component Library Hook
// Main hook for managing component library state and actions

"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { useLivePreview } from './use-live-preview';
import { useDesignConfig } from './use-design-config';
import {
  ComponentLibraryState,
  ComponentLibraryActions,
  ComponentDefinition,
  ComponentLibraryItem,
  ComponentCategory,
  GeneratedComponentCode,
  ComponentInsertionOptions,
  ComponentPreviewIntegration,
  LivePreviewComponent,
  ValidationResult,
  ExportFormat,
  UseComponentLibraryReturn
} from '@/types/component-library';
import {
  componentLibrary,
  getComponentById,
  getComponentsByCategory,
  searchComponents,
  getComponentCategories,
  exportComponent
} from '@/data/component-library';

export function useComponentLibrary() {
  const { state: livePreviewState, actions: livePreviewActions } = useLivePreview();
  const { config: designConfig } = useDesignConfig();

  // Component library state
  const [state, setState] = useState<ComponentLibraryState>({
    components: new Map(),
    categories: new Map(),
    installedComponents: new Set(),
    favorites: new Set(),
    recentlyUsed: [],
    searchIndex: new Map(),
    isLoading: false,
    error: undefined
  });

  // Component registry for live preview integration
  const [liveComponents, setLiveComponents] = useState<Map<string, LivePreviewComponent>>(new Map());
  const componentCounterRef = useRef(0);

  // Initialize component library
  const initializeLibrary = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: undefined }));

    try {
      // Load components into state
      const componentMap = new Map<string, ComponentLibraryItem>();
      const categoryMap = new Map<ComponentCategory, string[]>();
      const searchIndex = new Map<string, string[]>();

      componentLibrary.forEach(component => {
        const libraryItem: ComponentLibraryItem = {
          ...component,
          isInstalled: true,
          installDate: new Date().toISOString(),
          usageCount: 0
        };

        componentMap.set(component.metadata.id, libraryItem);

        // Add to category
        const category = component.metadata.category;
        if (!categoryMap.has(category)) {
          categoryMap.set(category, []);
        }
        categoryMap.get(category)!.push(component.metadata.id);

        // Build search index
        const searchableTerms = [
          component.metadata.name,
          component.metadata.description,
          ...component.metadata.tags
        ].map(term => term.toLowerCase());

        searchableTerms.forEach(term => {
          if (!searchIndex.has(term)) {
            searchIndex.set(term, []);
          }
          searchIndex.get(term)!.push(component.metadata.id);
        });
      });

      setState(prev => ({
        ...prev,
        components: componentMap,
        categories: categoryMap,
        searchIndex,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to initialize component library'
      }));
    }
  }, []);

  // Load components by category
  const loadComponents = useCallback(async (category?: ComponentCategory) => {
    setState(prev => ({ ...prev, isLoading: true, error: undefined }));

    try {
      let filteredComponents = componentLibrary;

      if (category) {
        filteredComponents = getComponentsByCategory(category);
      }

      const componentMap = new Map(state.components);

      filteredComponents.forEach(component => {
        const libraryItem: ComponentLibraryItem = {
          ...component,
          isInstalled: true,
          installDate: new Date().toISOString(),
          usageCount: componentMap.get(component.metadata.id)?.usageCount || 0
        };
        componentMap.set(component.metadata.id, libraryItem);
      });

      setState(prev => ({
        ...prev,
        components: componentMap,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load components'
      }));
    }
  }, [state.components]);

  // Install component
  const installComponent = useCallback(async (componentId: string) => {
    const component = getComponentById(componentId);
    if (!component) throw new Error(`Component ${componentId} not found`);

    setState(prev => {
      const newComponents = new Map(prev.components);
      const libraryItem: ComponentLibraryItem = {
        ...component,
        isInstalled: true,
        installDate: new Date().toISOString(),
        usageCount: 0
      };
      newComponents.set(componentId, libraryItem);

      return {
        ...prev,
        components: newComponents,
        installedComponents: new Set([...prev.installedComponents, componentId])
      };
    });
  }, []);

  // Uninstall component
  const uninstallComponent = useCallback(async (componentId: string) => {
    setState(prev => {
      const newComponents = new Map(prev.components);
      const newInstalled = new Set(prev.installedComponents);

      newComponents.delete(componentId);
      newInstalled.delete(componentId);

      return {
        ...prev,
        components: newComponents,
        installedComponents: newInstalled
      };
    });
  }, []);

  // Update component
  const updateComponent = useCallback(async (
    componentId: string,
    updates: Partial<ComponentDefinition>
  ) => {
    const existingComponent = state.components.get(componentId);
    if (!existingComponent) throw new Error(`Component ${componentId} not found`);

    setState(prev => {
      const newComponents = new Map(prev.components);
      const updatedComponent: ComponentLibraryItem = {
        ...existingComponent,
        ...updates,
        metadata: { ...existingComponent.metadata, ...updates.metadata }
      };
      newComponents.set(componentId, updatedComponent);

      return {
        ...prev,
        components: newComponents
      };
    });
  }, [state.components]);

  // Search components
  const searchComponentsAction = useCallback((query: string): ComponentLibraryItem[] => {
    if (!query.trim()) return Array.from(state.components.values());

    const results = searchComponents(query);
    return results.map(component => state.components.get(component.metadata.id)!).filter(Boolean);
  }, [state.components]);

  // Get component by ID
  const getComponentByIdAction = useCallback((id: string): ComponentLibraryItem | undefined => {
    return state.components.get(id);
  }, [state.components]);

  // Get components by category
  const getComponentsByCategoryAction = useCallback((category: ComponentCategory): ComponentLibraryItem[] => {
    const componentIds = state.categories.get(category) || [];
    return componentIds.map(id => state.components.get(id)!).filter(Boolean);
  }, [state.components, state.categories]);

  // Add to favorites
  const addToFavorites = useCallback((componentId: string) => {
    setState(prev => ({
      ...prev,
      favorites: new Set([...prev.favorites, componentId])
    }));
  }, []);

  // Remove from favorites
  const removeFromFavorites = useCallback((componentId: string) => {
    setState(prev => {
      const newFavorites = new Set(prev.favorites);
      newFavorites.delete(componentId);
      return {
        ...prev,
        favorites: newFavorites
      };
    });
  }, []);

  // Add to recently used
  const addToRecentlyUsed = useCallback((componentId: string) => {
    setState(prev => {
      const newRecentlyUsed = [componentId, ...prev.recentlyUsed.filter(id => id !== componentId)].slice(0, 10);
      return {
        ...prev,
        recentlyUsed: newRecentlyUsed
      };
    });
  }, []);

  // Generate component code
  const generateComponentCode = useCallback((
    componentId: string,
    props: Record<string, any>,
    variant?: string
  ): GeneratedComponentCode => {
    const component = state.components.get(componentId);
    if (!component) throw new Error(`Component ${componentId} not found`);

    // Update usage count
    setState(prev => {
      const newComponents = new Map(prev.components);
      const component = newComponents.get(componentId);
      if (component) {
        component.usageCount++;
        newComponents.set(componentId, component);
      }
      return {
        ...prev,
        components: newComponents
      };
    });

    // Add to recently used
    addToRecentlyUsed(componentId);

    // Generate code based on component type
    const generatedCode = generateComponentCodeInternal(component, props, variant);

    return {
      html: generatedCode.html,
      css: generatedCode.css,
      js: generatedCode.js,
      tsx: generatedCode.tsx,
      metadata: {
        componentId,
        variant: variant || 'default',
        props,
        dependencies: component.metadata.dependencies || [],
        designSystem: designConfig
      }
    };
  }, [state.components, designConfig, addToRecentlyUsed]);

  // Internal code generation function
  const generateComponentCodeInternal = (
    component: ComponentLibraryItem,
    props: Record<string, any>,
    variant?: string
  ): Partial<GeneratedComponentCode> => {
    let html = component.code.html || '';
    let css = component.code.css || '';
    let js = component.code.js || '';
    let tsx = component.code.tsx || '';

    // Replace template variables
    Object.entries(props).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, String(value));
      css = css.replace(regex, String(value));
      js = js.replace(regex, String(value));
      tsx = tsx.replace(regex, String(value));
    });

    // Apply variant styles
    if (variant && component.styles.variants?.[variant]) {
      css += component.styles.variants[variant];
    }

    // Apply design system variables
    css = applyDesignSystemVariables(css, designConfig);

    return { html, css, js, tsx };
  };

  // Apply design system variables to CSS
  const applyDesignSystemVariables = (css: string, designConfig: any): string => {
    // Replace CSS custom properties with design system values
    css = css.replace(/hsl\(var\(--primary\)\)/g, designConfig.colors.primary);
    css = css.replace(/hsl\(var\(--secondary\)\)/g, designConfig.colors.secondary);
    css = css.replace(/hsl\(var\(--accent\)\)/g, designConfig.colors.accent);
    css = css.replace(/hsl\(var\(--background\)\)/g, designConfig.colors.background);
    css = css.replace(/hsl\(var\(--foreground\)\)/g, designConfig.colors.text);

    // Apply spacing
    Object.entries(designConfig.spacing.spacing).forEach(([key, value]) => {
      css = css.replace(new RegExp(`var\\(--spacing-${key}\\)`, 'g'), value as string);
    });

    return css;
  };

  // Export component
  const exportComponentAction = useCallback((componentId: string, format: ExportFormat): string => {
    return exportComponent(componentId, format);
  }, []);

  // Import component
  const importComponent = useCallback(async (componentData: ComponentDefinition) => {
    setState(prev => {
      const newComponents = new Map(prev.components);
      const libraryItem: ComponentLibraryItem = {
        ...componentData,
        isInstalled: true,
        installDate: new Date().toISOString(),
        usageCount: 0
      };
      newComponents.set(componentData.metadata.id, libraryItem);

      // Update category
      const category = componentData.metadata.category;
      const newCategories = new Map(prev.categories);
      if (!newCategories.has(category)) {
        newCategories.set(category, []);
      }
      newCategories.get(category)!.push(componentData.metadata.id);

      return {
        ...prev,
        components: newComponents,
        categories: newCategories,
        installedComponents: new Set([...prev.installedComponents, componentData.metadata.id])
      };
    });
  }, []);

  // Validate component
  const validateComponent = useCallback((component: ComponentDefinition): ValidationResult => {
    const errors: any[] = [];
    const warnings: any[] = [];

    // Check required fields
    if (!component.metadata.id) {
      errors.push({ field: 'metadata.id', message: 'Component ID is required' });
    }
    if (!component.metadata.name) {
      errors.push({ field: 'metadata.name', message: 'Component name is required' });
    }
    if (!component.code.html && !component.code.tsx) {
      errors.push({ field: 'code', message: 'Component must have HTML or TSX code' });
    }

    // Validate props
    component.props.forEach(prop => {
      if (prop.required && prop.defaultValue === undefined) {
        warnings.push({
          field: `props.${prop.name}`,
          message: `Required prop '${prop.name}' should have a default value`
        });
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }, []);

  // Insert component into live preview
  const insertIntoLivePreview = useCallback(async (options: ComponentInsertionOptions): Promise<string> => {
    const {
      componentId,
      variant,
      props = {},
      position = 'append',
      targetElement,
      replaceExisting = false,
      preserveStyles = true,
      includeDependencies = true
    } = options;

    try {
      // Generate component code
      const generatedCode = generateComponentCode(componentId, props, variant);

      // Create live preview component
      const instanceId = `component-${componentId}-${++componentCounterRef.current}`;
      const previewComponent: LivePreviewComponent = {
        instanceId,
        componentId,
        previewId: `preview-${instanceId}`,
        props,
        variant: variant || 'default',
        generatedCode,
        isInteractive: true,
        eventListeners: new Map(),
        state: {}
      };

      // Add to live components
      setLiveComponents(prev => new Map(prev.set(instanceId, previewComponent)));

      // Insert into live preview
      const targetSelector = targetElement || 'body';
      const insertCode = `
        (() => {
          const component = ${JSON.stringify(generatedCode)};
          const target = document.querySelector('${targetSelector}');
          if (!target) return;

          // Create component wrapper
          const wrapper = document.createElement('div');
          wrapper.id = '${instanceId}';
          wrapper.className = 'live-component-wrapper';
          wrapper.innerHTML = component.html;

          // Insert based on position
          if ('${replaceExisting}') {
            target.innerHTML = '';
          }

          switch ('${position}') {
            case 'prepend':
              target.insertBefore(wrapper, target.firstChild);
              break;
            case 'before':
              target.parentNode?.insertBefore(wrapper, target);
              break;
            case 'after':
              target.parentNode?.insertAfter(wrapper, target);
              break;
            default: // append
              target.appendChild(wrapper);
          }

          // Add styles
          if (${preserveStyles} && component.css) {
            const style = document.createElement('style');
            style.id = 'style-${instanceId}';
            style.textContent = component.css;
            document.head.appendChild(style);
          }

          // Add JavaScript
          if (component.js) {
            try {
              const script = document.createElement('script');
              script.id = 'script-${instanceId}';
              script.textContent = component.js;
              document.body.appendChild(script);
            } catch (error) {
              console.error('Error executing component script:', error);
            }
          }
        })();
      `;

      // Execute in live preview
      if (livePreviewState.activeView === 'preview' || livePreviewState.activeView === 'split') {
        livePreviewActions.updateJS(insertCode);
      }

      return instanceId;
    } catch (error) {
      console.error('Failed to insert component into live preview:', error);
      throw error;
    }
  }, [generateComponentCode, livePreviewState.activeView, livePreviewActions]);

  // Remove component from live preview
  const removeFromLivePreview = useCallback((instanceId: string) => {
    setLiveComponents(prev => {
      const newComponents = new Map(prev);
      newComponents.delete(instanceId);
      return newComponents;
    });

    // Remove from DOM
    const removeCode = `
      const element = document.getElementById('${instanceId}');
      const style = document.getElementById('style-${instanceId}');
      const script = document.getElementById('script-${instanceId}');

      if (element) element.remove();
      if (style) style.remove();
      if (script) script.remove();
    `;

    if (livePreviewState.activeView === 'preview' || livePreviewState.activeView === 'split') {
      livePreviewActions.updateJS(removeCode);
    }
  }, [livePreviewState.activeView, livePreviewActions]);

  // Update component in live preview
  const updateLiveComponent = useCallback((instanceId: string, updates: Partial<ComponentPreviewIntegration>) => {
    setLiveComponents(prev => {
      const newComponents = new Map(prev);
      const component = newComponents.get(instanceId);
      if (component) {
        Object.assign(component, updates);
        newComponents.set(instanceId, component);
      }
      return newComponents;
    });
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeLibrary();
  }, [initializeLibrary]);

  // Actions object
  const actions: ComponentLibraryActions = {
    loadComponents,
    installComponent,
    uninstallComponent,
    updateComponent,
    searchComponents: searchComponentsAction,
    getComponentById: getComponentByIdAction,
    getComponentsByCategory: getComponentsByCategoryAction,
    addToFavorites,
    removeFromFavorites,
    addToRecentlyUsed,
    generateComponentCode,
    exportComponent: exportComponentAction,
    importComponent,
    validateComponent
  };

  return {
    state,
    actions,
    liveComponents,
    insertIntoLivePreview,
    removeFromLivePreview,
    updateLiveComponent
  };
}