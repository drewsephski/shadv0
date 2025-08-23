// Component Library Utilities
// Helper functions for component management, code generation, and integration

import {
  ComponentDefinition,
  ComponentLibraryItem,
  GeneratedComponentCode,
  ComponentInsertionOptions,
  ExportFormat,
  ValidationResult,
  ComponentPreviewIntegration
} from '@/types/component-library';
import { DesignSystemConfig } from '@/app/types';

/**
 * Generate a unique component ID
 */
export function generateComponentId(name: string, category: string): string {
  const sanitizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const sanitizedCategory = category.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const timestamp = Date.now();
  return `${sanitizedCategory}-${sanitizedName}-${timestamp}`;
}

/**
 * Generate a unique instance ID for live preview components
 */
export function generateInstanceId(componentId: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `component-${componentId}-${timestamp}-${random}`;
}

/**
 * Validate component props against component definition
 */
export function validateComponentProps(
  component: ComponentDefinition,
  props: Record<string, any>
): ValidationResult {
  const errors: any[] = [];
  const warnings: any[] = [];

  // Check required props
  component.props.forEach(prop => {
    if (prop.required && !(prop.name in props)) {
      if (prop.defaultValue === undefined) {
        errors.push({
          field: `props.${prop.name}`,
          message: `Required prop '${prop.name}' is missing`,
          severity: 'error'
        });
      } else {
        warnings.push({
          field: `props.${prop.name}`,
          message: `Using default value for required prop '${prop.name}'`,
          suggestion: `Consider providing a value for '${prop.name}'`
        });
      }
    }

    // Validate prop types
    if (prop.name in props) {
      const value = props[prop.name];
      const isValidType = validatePropType(value, prop.type);

      if (!isValidType) {
        warnings.push({
          field: `props.${prop.name}`,
          message: `Prop '${prop.name}' should be of type '${prop.type}'`,
          suggestion: `Expected ${prop.type}, got ${typeof value}`
        });
      }

      // Validate constraints
      if (prop.validation) {
        if (prop.validation.min !== undefined && value < prop.validation.min) {
          errors.push({
            field: `props.${prop.name}`,
            message: `Prop '${prop.name}' must be at least ${prop.validation.min}`,
            severity: 'error'
          });
        }
        if (prop.validation.max !== undefined && value > prop.validation.max) {
          errors.push({
            field: `props.${prop.name}`,
            message: `Prop '${prop.name}' must be at most ${prop.validation.max}`,
            severity: 'error'
          });
        }
        if (prop.validation.pattern && !new RegExp(prop.validation.pattern).test(value)) {
          errors.push({
            field: `props.${prop.name}`,
            message: `Prop '${prop.name}' does not match required pattern`,
            severity: 'error'
          });
        }
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate prop type
 */
function validatePropType(value: any, expectedType: string): boolean {
  switch (expectedType) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number';
    case 'boolean':
      return typeof value === 'boolean';
    case 'object':
      return typeof value === 'object' && value !== null;
    case 'array':
      return Array.isArray(value);
    case 'function':
      return typeof value === 'function';
    case 'color':
      return typeof value === 'string' && (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl'));
    case 'url':
      return typeof value === 'string' && (value.startsWith('http') || value.startsWith('/'));
    case 'enum':
      return true; // Enum validation is handled separately
    default:
      return true;
  }
}

/**
 * Generate component code with props interpolation
 */
export function generateComponentCode(
  component: ComponentDefinition,
  props: Record<string, any>,
  variant?: string,
  designSystem: DesignSystemConfig
): GeneratedComponentCode {
  let html = component.code.html || '';
  let css = component.code.css || '';
  let js = component.code.js || '';
  let tsx = component.code.tsx || '';

  // Apply variant styles
  if (variant && component.styles.variants?.[variant]) {
    css += '\n' + component.styles.variants[variant];
  }

  // Apply responsive styles
  if (component.styles.responsive) {
    const { sm, md, lg, xl } = component.styles.responsive;
    if (sm) css += `\n@media (min-width: 640px) { ${sm} }`;
    if (md) css += `\n@media (min-width: 768px) { ${md} }`;
    if (lg) css += `\n@media (min-width: 1024px) { ${lg} }`;
    if (xl) css += `\n@media (min-width: 1280px) { ${xl} }`;
  }

  // Apply dark mode styles
  if (designSystem.mode === 'dark' && component.styles.darkMode) {
    css += '\n' + component.styles.darkMode;
  }

  // Apply base styles
  css = component.styles.base + '\n' + css;

  // Interpolate props
  const interpolationData = {
    ...props,
    designSystem,
    variant: variant || 'default'
  };

  // Replace template variables
  Object.entries(interpolationData).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);

    html = html.replace(regex, stringValue);
    css = css.replace(regex, stringValue);
    js = js.replace(regex, stringValue);
    tsx = tsx.replace(regex, stringValue);
  });

  // Apply design system variables
  css = applyDesignSystemVariables(css, designSystem);

  return {
    html,
    css,
    js,
    tsx,
    metadata: {
      componentId: component.metadata.id,
      variant: variant || 'default',
      props,
      dependencies: component.metadata.dependencies || [],
      designSystem
    }
  };
}

/**
 * Apply design system variables to CSS
 */
export function applyDesignSystemVariables(css: string, designSystem: DesignSystemConfig): string {
  const { colors, typography, spacing } = designSystem;

  // Color variables
  Object.entries(colors).forEach(([key, value]) => {
    css = css.replace(new RegExp(`var\\(--color-${key}\\)`, 'g'), value);
    css = css.replace(new RegExp(`hsl\\(var\\(--${key}\\)\\)`, 'g'), value);
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

/**
 * Generate component insertion code for live preview
 */
export function generateComponentInsertionCode(
  generatedCode: GeneratedComponentCode,
  options: ComponentInsertionOptions
): string {
  const { componentId, position = 'append', targetElement = 'body', preserveStyles = true } = options;

  const instanceId = generateInstanceId(componentId);

  return `
    (() => {
      try {
        // Create component wrapper
        const wrapper = document.createElement('div');
        wrapper.id = '${instanceId}';
        wrapper.className = 'live-component-wrapper component-${componentId}';
        wrapper.setAttribute('data-component-id', '${componentId}');
        wrapper.setAttribute('data-variant', '${generatedCode.metadata.variant}');

        // Set component content
        wrapper.innerHTML = \`${generatedCode.html}\`;

        // Find target element
        const target = '${targetElement}' === 'body' ? document.body : document.querySelector('${targetElement}');
        if (!target) {
          console.error('Target element not found:', '${targetElement}');
          return '${instanceId}';
        }

        // Insert component based on position
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

        // Add styles if requested
        ${preserveStyles && generatedCode.css ? `
          const styleId = 'style-${instanceId}';
          let styleElement = document.getElementById(styleId);
          if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
          }
          styleElement.textContent = \`${generatedCode.css}\`;
        ` : ''}

        // Add JavaScript if present
        ${generatedCode.js ? `
          const scriptId = 'script-${instanceId}';
          let scriptElement = document.getElementById(scriptId);
          if (!scriptElement) {
            scriptElement = document.createElement('script');
            scriptElement.id = scriptId;
            scriptElement.textContent = \`${generatedCode.js}\`;
            document.body.appendChild(scriptElement);
          }
        ` : ''}

        // Initialize component if it has an init function
        if (window.componentInit && typeof window.componentInit['${componentId}'] === 'function') {
          window.componentInit['${componentId}']('${instanceId}', ${JSON.stringify(generatedCode.metadata.props)});
        }

        return '${instanceId}';
      } catch (error) {
        console.error('Failed to insert component:', error);
        return null;
      }
    })();
  `;
}

/**
 * Generate component removal code for live preview
 */
export function generateComponentRemovalCode(instanceId: string): string {
  return `
    (() => {
      try {
        const element = document.getElementById('${instanceId}');
        const styleElement = document.getElementById('style-${instanceId}');
        const scriptElement = document.getElementById('script-${instanceId}');

        // Remove main element
        if (element) {
          element.remove();
        }

        // Remove styles
        if (styleElement) {
          styleElement.remove();
        }

        // Remove scripts
        if (scriptElement) {
          scriptElement.remove();
        }

        return true;
      } catch (error) {
        console.error('Failed to remove component:', error);
        return false;
      }
    })();
  `;
}

/**
 * Export component to different formats
 */
export function exportComponentToFormat(
  component: ComponentDefinition,
  format: ExportFormat,
  options: {
    variant?: string;
    props?: Record<string, any>;
    designSystem?: DesignSystemConfig;
  } = {}
): string {
  const { variant, props = {}, designSystem } = options;

  switch (format) {
    case 'html':
      return generateComponentCode(component, props, variant, designSystem || getDefaultDesignSystem()).html;

    case 'jsx':
      return generateComponentCode(component, props, variant, designSystem || getDefaultDesignSystem()).tsx || '';

    case 'vue':
      return generateVueComponent(component, props, variant, designSystem || getDefaultDesignSystem());

    case 'svelte':
      return generateSvelteComponent(component, props, variant, designSystem || getDefaultDesignSystem());

    case 'json':
      return JSON.stringify(component, null, 2);

    case 'component-library':
      return JSON.stringify({
        ...component,
        exportFormat: 'component-library',
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      }, null, 2);

    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

/**
 * Generate Vue component code
 */
function generateVueComponent(
  component: ComponentDefinition,
  props: Record<string, any>,
  variant?: string,
  designSystem: DesignSystemConfig
): string {
  const generatedCode = generateComponentCode(component, props, variant, designSystem);

  return `
<template>
  <div class="vue-component-wrapper">
    ${generatedCode.html}
  </div>
</template>

<script>
export default {
  name: '${component.metadata.name}',
  props: ${JSON.stringify(component.props.map(prop => ({
    [prop.name]: {
      type: getVuePropType(prop.type),
      required: prop.required,
      default: prop.defaultValue
    }
  })).reduce((acc, curr) => ({ ...acc, ...curr }), {}), null, 2)},
  mounted() {
    this.initializeComponent();
  },
  beforeDestroy() {
    this.cleanupComponent();
  },
  methods: {
    initializeComponent() {
      // Initialize component logic here
    },
    cleanupComponent() {
      // Cleanup component logic here
    }
  }
}
</script>

<style scoped>
${generatedCode.css}
</style>
  `.trim();
}

/**
 * Generate Svelte component code
 */
function generateSvelteComponent(
  component: ComponentDefinition,
  props: Record<string, any>,
  variant?: string,
  designSystem: DesignSystemConfig
): string {
  const generatedCode = generateComponentCode(component, props, variant, designSystem);

  return `
<script>
  ${component.props.map(prop => `export let ${prop.name}${prop.defaultValue !== undefined ? ` = ${JSON.stringify(prop.defaultValue)}` : ''};`).join('\n  ')}

  import { onMount } from 'svelte';

  onMount(() => {
    // Initialize component logic here
  });
</script>

<div class="svelte-component-wrapper">
  ${generatedCode.html}
</div>

<style>
  ${generatedCode.css}
</style>
  `.trim();
}

/**
 * Get Vue prop type
 */
function getVuePropType(type: string): string {
  switch (type) {
    case 'string':
      return 'String';
    case 'number':
      return 'Number';
    case 'boolean':
      return 'Boolean';
    case 'array':
      return 'Array';
    case 'object':
      return 'Object';
    case 'function':
      return 'Function';
    default:
      return 'String';
  }
}

/**
 * Get default design system
 */
function getDefaultDesignSystem(): DesignSystemConfig {
  return {
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
  };
}

/**
 * Calculate component size based on content and props
 */
export function calculateComponentSize(
  component: ComponentDefinition,
  props: Record<string, any>
): { width: number; height: number } {
  // This is a simplified calculation - in practice, you might want to use
  // a more sophisticated approach like rendering to a hidden element

  let width = 300; // Default width
  let height = 200; // Default height

  // Adjust based on component type and props
  switch (component.metadata.category) {
    case 'forms':
      if (component.metadata.id === 'button') {
        width = 120;
        height = 40;
      } else if (component.metadata.id === 'input') {
        width = 300;
        height = 40;
      }
      break;
    case 'data-display':
      if (component.metadata.id === 'card') {
        width = 320;
        height = 200;
      }
      break;
    case 'navigation':
      if (component.metadata.id.includes('navbar')) {
        width = '100%';
        height = 60;
      }
      break;
  }

  return { width: typeof width === 'number' ? width : 300, height: typeof height === 'number' ? height : 200 };
}

/**
 * Generate component preview image (placeholder implementation)
 */
export async function generateComponentPreviewImage(
  component: ComponentDefinition,
  props: Record<string, any>,
  variant?: string
): Promise<string> {
  // This is a placeholder implementation
  // In a real implementation, you might use Puppeteer or a similar tool
  // to render the component and take a screenshot

  const size = calculateComponentSize(component, props);
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${size.width}" height="${size.height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <rect x="10" y="10" width="${size.width - 20}" height="${size.height - 20}" fill="white" stroke="#e2e8f0" rx="4"/>
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#6b7280" font-family="system-ui" font-size="14">
        ${component.metadata.name} Preview
      </text>
    </svg>
  `)}`;
}

/**
 * Check if a component is compatible with the current environment
 */
export function checkComponentCompatibility(
  component: ComponentDefinition,
  browserSupport?: Record<string, string>
): { compatible: boolean; issues: string[] } {
  const issues: string[] = [];

  // Check dependencies
  if (component.metadata.dependencies && component.metadata.dependencies.length > 0) {
    // This would check if required libraries are available
    // For now, just log a warning
    issues.push(`Component requires dependencies: ${component.metadata.dependencies.join(', ')}`);
  }

  // Check browser support
  if (component.documentation?.browserSupport) {
    // This would check against the current browser
    // For now, just validate the format
    Object.entries(component.documentation.browserSupport).forEach(([browser, version]) => {
      if (!version.match(/^\d+\.?\d*$/)) {
        issues.push(`Invalid browser version format: ${browser} ${version}`);
      }
    });
  }

  return {
    compatible: issues.length === 0,
    issues
  };
}