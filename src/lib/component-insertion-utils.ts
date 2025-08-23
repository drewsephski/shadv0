// Component Insertion Utilities
// Advanced utilities for component insertion, validation, and management

import {
  ComponentInsertionOptions,
  ComponentValidationResult,
  ComponentValidationError,
  ComponentValidationWarning,
  LivePreviewComponent,
  ComponentInsertionHistory,
  ComponentInsertionContext,
  ComponentInsertionMetrics,
  GeneratedComponentCode,
  ComponentDefinition
} from '@/types/component-library';
import { DesignSystemConfig } from '@/app/types';

// Feature Configuration
export interface ComponentInsertionFeatureConfig {
  enabled: boolean;
  enableDragDrop: boolean;
  enableResize: boolean;
  enableSnapping: boolean;
  enableGuides: boolean;
  enableUndoRedo: boolean;
  enableKeyboardShortcuts: boolean;
  enableAccessibility: boolean;
  enablePerformanceMonitoring: boolean;
  maxHistorySize: number;
  snapGridSize: number;
  snapThreshold: number;
  performanceMode: 'speed' | 'quality' | 'balanced';
}

// Default feature configuration
export const defaultComponentInsertionConfig: ComponentInsertionFeatureConfig = {
  enabled: false, // Disabled by default - must be explicitly enabled
  enableDragDrop: true,
  enableResize: true,
  enableSnapping: true,
  enableGuides: true,
  enableUndoRedo: true,
  enableKeyboardShortcuts: true,
  enableAccessibility: true,
  enablePerformanceMonitoring: false,
  maxHistorySize: 50,
  snapGridSize: 10,
  snapThreshold: 5,
  performanceMode: 'balanced'
};

// Component Insertion Engine
export class ComponentInsertionEngine {
  private static instance: ComponentInsertionEngine;
  private componentCache = new Map<string, ComponentDefinition>();
  private insertionHistory: ComponentInsertionHistory[] = [];
  private historyIndex = -1;
  private maxHistorySize = 50;

  static getInstance(): ComponentInsertionEngine {
    if (!ComponentInsertionEngine.instance) {
      ComponentInsertionEngine.instance = new ComponentInsertionEngine();
    }
    return ComponentInsertionEngine.instance;
  }

  // Generate unique instance ID
  generateInstanceId(componentId: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `component-${componentId}-${timestamp}-${random}`;
  }

  // Smart insertion logic
  async insertComponent(
    options: ComponentInsertionOptions,
    designConfig: DesignSystemConfig,
    existingComponents: Map<string, LivePreviewComponent>
  ): Promise<{ instanceId: string; code: string; component: LivePreviewComponent }> {
    const {
      componentId,
      variant,
      props = {},
      position = 'append',
      targetElement,
      replaceExisting = false,
      preserveStyles = true,
      includeDependencies = true,
      insertionPoint,
      zIndex,
      groupId,
      metadata = {}
    } = options;

    // Validate insertion
    const validation = await this.validateComponentInsertion(options, existingComponents);
    if (!validation.isValid) {
      throw new Error(`Component insertion validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    // Generate component code
    const generatedCode = await this.generateComponentCode(componentId, props, variant || 'default', designConfig);

    // Create instance ID
    const instanceId = this.generateInstanceId(componentId);

    // Create live preview component
    const liveComponent: LivePreviewComponent = {
      instanceId,
      componentId,
      previewId: `preview-${instanceId}`,
      props,
      variant: variant || 'default',
      generatedCode,
      isInteractive: true,
      eventListeners: new Map(),
      state: {},
      position: insertionPoint,
      zIndex,
      groupId,
      isLocked: false,
      isVisible: true
    };

    // Generate insertion code
    const insertionCode = this.generateInsertionCode(liveComponent, {
      position,
      targetElement,
      replaceExisting,
      preserveStyles,
      includeDependencies
    });

    // Add to history
    this.addToHistory('insert', componentId, instanceId, undefined, { props, position: insertionPoint });

    return { instanceId, code: insertionCode, component: liveComponent };
  }

  // Generate component code with design system integration
  private async generateComponentCode(
    componentId: string,
    props: Record<string, any>,
    variant: string,
    designConfig: DesignSystemConfig
  ): Promise<GeneratedComponentCode> {
    // Get component from cache or load it
    const component = this.componentCache.get(componentId);
    if (!component) {
      throw new Error(`Component ${componentId} not found`);
    }

    let html = component.code.html || '';
    let css = component.code.css || '';
    let js = component.code.js || '';

    // Apply template variables
    Object.entries(props).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, String(value));
      css = css.replace(regex, String(value));
      js = js.replace(regex, String(value));
    });

    // Apply variant styles
    if (variant && component.styles.variants?.[variant]) {
      css += component.styles.variants[variant];
    }

    // Apply design system variables
    css = this.applyDesignSystemVariables(css, designConfig);

    // Optimize code
    const optimized = this.optimizeComponentCode({ html, css, js, metadata: {} });

    return {
      html: optimized.html,
      css: optimized.css,
      js: optimized.js,
      metadata: {
        componentId,
        variant,
        props,
        dependencies: component.metadata.dependencies || [],
        designSystem: designConfig
      }
    };
  }

  // Apply design system variables to CSS
  private applyDesignSystemVariables(css: string, designConfig: DesignSystemConfig): string {
    const { colors, typography, spacing } = designConfig;

    // Color variables
    Object.entries(colors).forEach(([key, value]) => {
      const regex = new RegExp(`hsl\\(var\\(--${key}\\)\\)`, 'g');
      css = css.replace(regex, value);
    });

    // Typography variables
    css = css.replace(/var\(--font-family-primary\)/g, typography.fontFamily);
    Object.entries(typography.fontSize).forEach(([key, value]) => {
      css = css.replace(new RegExp(`var\\(--font-size-${key}\\)`, 'g'), value);
    });
    Object.entries(typography.fontWeight).forEach(([key, value]) => {
      css = css.replace(new RegExp(`var\\(--font-weight-${key}\\)`, 'g'), value.toString());
    });
    Object.entries(typography.lineHeight).forEach(([key, value]) => {
      css = css.replace(new RegExp(`var\\(--line-height-${key}\\)`, 'g'), value.toString());
    });

    // Spacing variables
    Object.entries(spacing.spacing).forEach(([key, value]) => {
      css = css.replace(new RegExp(`var\\(--spacing-${key}\\)`, 'g'), value);
    });
    Object.entries(spacing.borderRadius).forEach(([key, value]) => {
      css = css.replace(new RegExp(`var\\(--border-radius-${key}\\)`, 'g'), value);
    });

    return css;
  }

  // Generate insertion JavaScript code
  private generateInsertionCode(
    component: LivePreviewComponent,
    options: {
      position: string;
      targetElement?: string;
      replaceExisting: boolean;
      preserveStyles: boolean;
      includeDependencies: boolean;
    }
  ): string {
    const { instanceId, generatedCode } = component;
    const { position, targetElement, replaceExisting, preserveStyles } = options;

    return `
      (() => {
        try {
          const component = ${JSON.stringify(generatedCode)};
          const target = ${targetElement ? `document.querySelector('${targetElement}')` : 'document.body'};
          if (!target) return '${instanceId}';

          // Create component wrapper
          const wrapper = document.createElement('div');
          wrapper.id = '${instanceId}';
          wrapper.className = 'live-component-wrapper';
          wrapper.innerHTML = component.html;

          // Set position if specified
          ${component.position ? `
            wrapper.style.position = 'absolute';
            wrapper.style.left = '${component.position.x}px';
            wrapper.style.top = '${component.position.y}px';
          ` : ''}

          // Set z-index if specified
          ${component.zIndex !== undefined ? `wrapper.style.zIndex = '${component.zIndex}';` : ''}

          // Handle insertion based on position
          if (${replaceExisting}) {
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
            case 'cursor':
              // Insert at cursor position (would need cursor tracking)
              target.appendChild(wrapper);
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

          return '${instanceId}';
        } catch (error) {
          console.error('Component insertion error:', error);
          throw error;
        }
      })();
    `;
  }

  // Validate component insertion
  async validateComponentInsertion(
    options: ComponentInsertionOptions,
    existingComponents: Map<string, LivePreviewComponent>
  ): Promise<ComponentValidationResult> {
    const errors: ComponentValidationError[] = [];
    const warnings: ComponentValidationWarning[] = [];
    const suggestions: string[] = [];

    // Check if component exists
    if (!this.componentCache.has(options.componentId)) {
      errors.push({
        field: 'componentId',
        message: `Component '${options.componentId}' not found`,
        severity: 'error'
      });
      return { isValid: false, errors, warnings, suggestions };
    }

    // Check for duplicate instances if needed
    if (options.replaceExisting === false) {
      const existingCount = Array.from(existingComponents.values())
        .filter(c => c.componentId === options.componentId).length;

      if (existingCount > 5) {
        warnings.push({
          field: 'componentId',
          message: `Multiple instances of '${options.componentId}' detected`,
          suggestion: 'Consider using different variants or grouping components'
        });
      }
    }

    // Validate props
    const component = this.componentCache.get(options.componentId)!;
    const propValidation = this.validateProps(component, options.props || {});
    errors.push(...propValidation.errors);
    warnings.push(...propValidation.warnings);

    // Check insertion point
    if (options.insertionPoint) {
      if (options.insertionPoint.x < 0 || options.insertionPoint.y < 0) {
        warnings.push({
          field: 'insertionPoint',
          message: 'Negative position values may cause layout issues'
        });
      }
    }

    // Check target element
    if (options.targetElement) {
      suggestions.push(`Ensure '${options.targetElement}' exists in the DOM before insertion`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  // Validate component props
  private validateProps(
    component: ComponentDefinition,
    props: Record<string, any>
  ): { errors: ComponentValidationError[]; warnings: ComponentValidationWarning[] } {
    const errors: ComponentValidationError[] = [];
    const warnings: ComponentValidationWarning[] = [];

    component.props.forEach(prop => {
      const value = props[prop.name];

      if (prop.required && (value === undefined || value === null || value === '')) {
        errors.push({
          field: `props.${prop.name}`,
          message: `Required prop '${prop.name}' is missing`,
          severity: 'error'
        });
      }

      if (value !== undefined) {
        // Type validation
        if (prop.type === 'string' && typeof value !== 'string') {
          warnings.push({
            field: `props.${prop.name}`,
            message: `Prop '${prop.name}' should be a string`
          });
        } else if (prop.type === 'number' && typeof value !== 'number') {
          warnings.push({
            field: `props.${prop.name}`,
            message: `Prop '${prop.name}' should be a number`
          });
        } else if (prop.type === 'boolean' && typeof value !== 'boolean') {
          warnings.push({
            field: `props.${prop.name}`,
            message: `Prop '${prop.name}' should be a boolean`
          });
        }

        // Range validation
        if (prop.validation?.min !== undefined && value < prop.validation.min) {
          errors.push({
            field: `props.${prop.name}`,
            message: `Prop '${prop.name}' must be at least ${prop.validation.min}`,
            severity: 'error'
          });
        }
        if (prop.validation?.max !== undefined && value > prop.validation.max) {
          errors.push({
            field: `props.${prop.name}`,
            message: `Prop '${prop.name}' must be at most ${prop.validation.max}`,
            severity: 'error'
          });
        }
      }
    });

    return { errors, warnings };
  }

  // Remove component
  async removeComponent(
    instanceId: string,
    existingComponents: Map<string, LivePreviewComponent>
  ): Promise<string> {
    const component = existingComponents.get(instanceId);
    if (!component) {
      throw new Error(`Component instance '${instanceId}' not found`);
    }

    // Add to history before removal
    this.addToHistory('remove', component.componentId, instanceId, component, undefined);

    const removeCode = `
      const element = document.getElementById('${instanceId}');
      const style = document.getElementById('style-${instanceId}');
      const script = document.getElementById('script-${instanceId}');

      if (element) element.remove();
      if (style) style.remove();
      if (script) script.remove();
    `;

    return removeCode;
  }

  // Update component
  async updateComponent(
    instanceId: string,
    updates: Partial<LivePreviewComponent>,
    existingComponents: Map<string, LivePreviewComponent>,
    designConfig: DesignSystemConfig
  ): Promise<{ code: string; component: LivePreviewComponent }> {
    const component = existingComponents.get(instanceId);
    if (!component) {
      throw new Error(`Component instance '${instanceId}' not found`);
    }

    const previousState = { ...component };
    const updatedComponent = { ...component, ...updates };

    // Add to history
    this.addToHistory('modify', component.componentId, instanceId, previousState, updatedComponent);

    // Generate update code
    let updateCode = '';

    if (updates.props) {
      // Regenerate component with new props
      const newCode = await this.generateComponentCode(
        component.componentId,
        updates.props,
        component.variant,
        designConfig
      );

      updateCode = `
        const element = document.getElementById('${instanceId}');
        if (element) {
          element.innerHTML = ${JSON.stringify(newCode.html)};
        }

        // Update styles
        const existingStyle = document.getElementById('style-${instanceId}');
        if (existingStyle) {
          existingStyle.textContent = ${JSON.stringify(newCode.css)};
        }
      `;
    }

    if (updates.position) {
      updateCode += `
        const element = document.getElementById('${instanceId}');
        if (element) {
          element.style.left = '${updates.position.x}px';
          element.style.top = '${updates.position.y}px';
        }
      `;
    }

    return { code: updateCode, component: updatedComponent };
  }

  // Undo/Redo functionality
  async undo(): Promise<ComponentInsertionHistory | null> {
    if (this.historyIndex < 0) return null;

    const action = this.insertionHistory[this.historyIndex];
    this.historyIndex--;

    return action;
  }

  async redo(): Promise<ComponentInsertionHistory | null> {
    if (this.historyIndex >= this.insertionHistory.length - 1) return null;

    this.historyIndex++;
    const action = this.insertionHistory[this.historyIndex];

    return action;
  }

  // History management
  private addToHistory(
    action: 'insert' | 'remove' | 'modify' | 'move',
    componentId: string,
    instanceId: string,
    previousState?: any,
    newState?: any,
    position?: { x: number; y: number }
  ): void {
    const historyEntry: ComponentInsertionHistory = {
      id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      action,
      componentId,
      instanceId,
      previousState,
      newState,
      position
    };

    // Remove any history after current index (for when we're not at the end)
    this.insertionHistory = this.insertionHistory.slice(0, this.historyIndex + 1);

    // Add new entry
    this.insertionHistory.push(historyEntry);
    this.historyIndex++;

    // Limit history size
    if (this.insertionHistory.length > this.maxHistorySize) {
      this.insertionHistory = this.insertionHistory.slice(-this.maxHistorySize);
      this.historyIndex = this.insertionHistory.length - 1;
    }
  }

  // Optimize component code
  private optimizeComponentCode(code: GeneratedComponentCode): GeneratedComponentCode {
    return {
      ...code,
      // Minify CSS
      css: code.css
        .replace(/\s+/g, ' ')
        .replace(/\s*([{}:;,>+~])\s*/g, '$1')
        .trim(),
      // Minify JS
      js: code.js
        .replace(/\s+/g, ' ')
        .replace(/\s*([{}();:,+=\-*/&|!<>?%~^])\s*/g, '$1')
        .trim()
    };
  }

  // Get component at position
  getComponentAtPosition(
    x: number,
    y: number,
    components: Map<string, LivePreviewComponent>
  ): string | null {
    for (const [instanceId, component] of components) {
      if (component.position) {
        const { x: compX, y: compY } = component.position;
        // Simple bounding box check (you might want to make this more sophisticated)
        if (Math.abs(x - compX) < 50 && Math.abs(y - compY) < 50) {
          return instanceId;
        }
      }
    }
    return null;
  }

  // Get components in area
  getComponentsInArea(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    components: Map<string, LivePreviewComponent>
  ): string[] {
    const result: string[] = [];

    for (const [instanceId, component] of components) {
      if (component.position) {
        const { x, y } = component.position;
        if (x >= startX && x <= endX && y >= startY && y <= endY) {
          result.push(instanceId);
        }
      }
    }

    return result;
  }

  // Group components
  groupComponents(
    instanceIds: string[],
    groupId: string,
    components: Map<string, LivePreviewComponent>
  ): Map<string, LivePreviewComponent> {
    const updatedComponents = new Map(components);

    instanceIds.forEach(instanceId => {
      const component = updatedComponents.get(instanceId);
      if (component) {
        updatedComponents.set(instanceId, { ...component, groupId });
      }
    });

    return updatedComponents;
  }

  // Ungroup components
  ungroupComponents(
    groupId: string,
    components: Map<string, LivePreviewComponent>
  ): Map<string, LivePreviewComponent> {
    const updatedComponents = new Map(components);

    for (const [instanceId, component] of components) {
      if (component.groupId === groupId) {
        const { groupId: _, ...rest } = component;
        updatedComponents.set(instanceId, rest);
      }
    }

    return updatedComponents;
  }

  // Cache component
  cacheComponent(component: ComponentDefinition): void {
    this.componentCache.set(component.metadata.id, component);
  }

  // Get cached component
  getCachedComponent(componentId: string): ComponentDefinition | undefined {
    return this.componentCache.get(componentId);
  }

  // Clear cache
  clearCache(): void {
    this.componentCache.clear();
  }

  // Get insertion history
  getHistory(): ComponentInsertionHistory[] {
    return [...this.insertionHistory];
  }

  // Clear history
  clearHistory(): void {
    this.insertionHistory = [];
    this.historyIndex = -1;
  }

  // Get metrics
  getMetrics(): ComponentInsertionMetrics {
    return {
      loadTime: performance.now(),
      renderTime: 0, // Would be measured during actual rendering
      memoryUsage: 0, // Would be measured in browser
      componentCount: this.componentCache.size,
      errorCount: 0, // Would track actual errors
      warningCount: 0 // Would track actual warnings
    };
  }
}

// Utility functions
export const componentInsertionUtils = {
  // Generate component selector
  generateSelector: (instanceId: string): string => `#${instanceId}`,

  // Check if element exists
  elementExists: (selector: string): boolean => {
    try {
      return document.querySelector(selector) !== null;
    } catch {
      return false;
    }
  },

  // Get element bounds
  getElementBounds: (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height
    };
  },

  // Calculate optimal insertion position
  calculateOptimalPosition: (
    insertionPoint: { x: number; y: number },
    componentSize: { width: number; height: number },
    viewport: { width: number; height: number }
  ) => {
    let { x, y } = insertionPoint;

    // Keep component within viewport bounds
    if (x + componentSize.width > viewport.width) {
      x = viewport.width - componentSize.width - 10;
    }
    if (y + componentSize.height > viewport.height) {
      y = viewport.height - componentSize.height - 10;
    }

    // Ensure minimum margin from edges
    x = Math.max(10, x);
    y = Math.max(10, y);

    return { x, y };
  },

  // Snap to grid
  snapToGrid: (position: { x: number; y: number }, gridSize: number = 10) => ({
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize
  }),

  // Check for component collisions
  checkCollision: (
    position1: { x: number; y: number; width: number; height: number },
    position2: { x: number; y: number; width: number; height: number }
  ): boolean => {
    return !(
      position1.x + position1.width < position2.x ||
      position2.x + position2.width < position1.x ||
      position1.y + position1.height < position2.y ||
      position2.y + position2.height < position1.y
    );
  },

  // Generate unique ID
  generateId: (prefix: string = 'component'): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${prefix}-${timestamp}-${random}`;
  },

  // Debounce function for performance
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Throttle function for performance
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// Export singleton instance
export const componentInsertionEngine = ComponentInsertionEngine.getInstance();