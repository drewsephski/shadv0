// Component Library Types and Interfaces
// Extends the existing template system with component-specific functionality

import { DesignSystemConfig } from '@/app/types';

// Base component metadata
export interface ComponentMetadata {
  id: string;
  name: string;
  description: string;
  category: ComponentCategory;
  subcategory?: string;
  tags: string[];
  version: string;
  author?: string;
  license?: string;
  dependencies?: string[];
  featured?: boolean;
  deprecated?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Component categories for organization
export type ComponentCategory =
  | 'layout'
  | 'navigation'
  | 'forms'
  | 'data-display'
  | 'feedback'
  | 'overlay'
  | 'media'
  | 'typography'
  | 'icons'
  | 'charts'
  | 'ecommerce'
  | 'social'
  | 'utilities';

// Component prop definition
export interface ComponentProp {
  name: string;
  type: PropType;
  required: boolean;
  defaultValue?: any;
  description?: string;
  options?: string[]; // For enum/select types
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: string;
  };
}

// Property types
export type PropType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'array'
  | 'function'
  | 'enum'
  | 'color'
  | 'icon'
  | 'image'
  | 'date'
  | 'url';

// Component variant definition
export interface ComponentVariant {
  id: string;
  name: string;
  description?: string;
  previewImage?: string;
  props: Record<string, any>;
  responsive?: {
    mobile?: Record<string, any>;
    tablet?: Record<string, any>;
    desktop?: Record<string, any>;
  };
}

// Component definition structure
export interface ComponentDefinition {
  metadata: ComponentMetadata;
  props: ComponentProp[];
  variants: ComponentVariant[];
  slots?: ComponentSlot[];
  events?: ComponentEvent[];
  styles: ComponentStyles;
  code: ComponentCode;
  documentation?: ComponentDocumentation;
}

// Component slot for content insertion
export interface ComponentSlot {
  name: string;
  description?: string;
  required?: boolean;
  defaultContent?: string;
  allowedComponents?: string[]; // Component IDs that can be placed in this slot
}

// Component event definition
export interface ComponentEvent {
  name: string;
  description?: string;
  payload?: Record<string, PropType>;
}

// Component styles
export interface ComponentStyles {
  base: string; // Base CSS styles
  variants?: Record<string, string>; // Variant-specific styles
  responsive?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
  darkMode?: string; // Dark mode specific styles
}

// Component code generation
export interface ComponentCode {
  html: string;
  css?: string;
  js?: string;
  tsx?: string; // For React components
  vue?: string; // For Vue components
  svelte?: string; // For Svelte components
}

// Component documentation
export interface ComponentDocumentation {
  description: string;
  usage: string;
  examples: CodeExample[];
  accessibility?: AccessibilityInfo;
  browserSupport?: BrowserSupport;
}

// Code example
export interface CodeExample {
  title: string;
  description?: string;
  code: string;
  language: 'html' | 'css' | 'javascript' | 'typescript' | 'jsx';
  previewImage?: string;
}

// Accessibility information
export interface AccessibilityInfo {
  ariaSupport: boolean;
  keyboardNavigation: boolean;
  screenReaderSupport: boolean;
  focusManagement: boolean;
  colorContrast: boolean;
  motionSensitivity: boolean;
  highContrastSupport: boolean;
}

// Browser support information
export interface BrowserSupport {
  chrome?: string;
  firefox?: string;
  safari?: string;
  edge?: string;
  ie?: string;
}

// Component library entry
export interface ComponentLibraryItem extends ComponentDefinition {
  // Additional library-specific properties
  isInstalled: boolean;
  installDate?: string;
  usageCount: number;
  rating?: number;
  reviews?: ComponentReview[];
  downloadUrl?: string;
  repository?: string;
}

// Component review
export interface ComponentReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

// Component library configuration
export interface ComponentLibraryConfig {
  categories: ComponentCategory[];
  defaultCategory: ComponentCategory;
  maxPreviewItems: number;
  enableAutoUpdate: boolean;
  enableOfflineMode: boolean;
  cacheStrategy: 'memory' | 'localStorage' | 'indexedDB';
  cdnUrl?: string;
}

// Component library state
export interface ComponentLibraryState {
  components: Map<string, ComponentLibraryItem>;
  categories: Map<ComponentCategory, string[]>; // category -> component IDs
  installedComponents: Set<string>;
  favorites: Set<string>;
  recentlyUsed: string[];
  searchIndex: Map<string, string[]>; // search term -> component IDs
  isLoading: boolean;
  error?: string;
}

// Component library actions
export interface ComponentLibraryActions {
  loadComponents: (category?: ComponentCategory) => Promise<void>;
  installComponent: (componentId: string) => Promise<void>;
  uninstallComponent: (componentId: string) => Promise<void>;
  updateComponent: (componentId: string, updates: Partial<ComponentDefinition>) => Promise<void>;
  searchComponents: (query: string) => ComponentLibraryItem[];
  getComponentById: (id: string) => ComponentLibraryItem | undefined;
  getComponentsByCategory: (category: ComponentCategory) => ComponentLibraryItem[];
  addToFavorites: (componentId: string) => void;
  removeFromFavorites: (componentId: string) => void;
  addToRecentlyUsed: (componentId: string) => void;
  generateComponentCode: (componentId: string, props: Record<string, any>, variant?: string) => GeneratedComponentCode;
  exportComponent: (componentId: string, format: ExportFormat) => string;
  importComponent: (componentData: ComponentDefinition) => Promise<void>;
  validateComponent: (component: ComponentDefinition) => ValidationResult;
}

// Generated component code result
export interface GeneratedComponentCode {
  html: string;
  css: string;
  js: string;
  tsx?: string;
  metadata: {
    componentId: string;
    variant: string;
    props: Record<string, any>;
    dependencies: string[];
    designSystem: DesignSystemConfig;
  };
}

// Export formats
export type ExportFormat = 'html' | 'jsx' | 'vue' | 'svelte' | 'json' | 'component-library';

// Validation result
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

// Validation error
export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
  suggestion?: string;
}

// Validation warning
export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

// Component library hook return type
export interface UseComponentLibraryReturn {
  state: ComponentLibraryState;
  actions: ComponentLibraryActions;
  config: ComponentLibraryConfig;
}

// Component integration with live preview
export interface ComponentPreviewIntegration {
  componentId: string;
  previewId: string;
  props: Record<string, any>;
  variant?: string;
  position?: {
    x: number;
    y: number;
  };
  size?: {
    width: number;
    height: number;
  };
  zIndex?: number;
  isLocked?: boolean;
  isVisible?: boolean;
}

// Live preview component instance
export interface LivePreviewComponent extends ComponentPreviewIntegration {
  instanceId: string;
  generatedCode: GeneratedComponentCode;
  iframeElement?: HTMLElement;
  eventListeners: Map<string, (event: Event) => void>;
  state: Record<string, unknown>;
  isInteractive: boolean;
  groupId?: string;
}

// Component insertion options
export interface ComponentInsertionOptions {
  componentId: string;
  variant?: string;
  props?: Record<string, any>;
  position?: 'append' | 'prepend' | 'before' | 'after' | 'replace' | 'cursor';
  targetElement?: string; // CSS selector
  targetInstanceId?: string; // For inserting relative to another component
  replaceExisting?: boolean;
  preserveStyles?: boolean;
  includeDependencies?: boolean;
  insertionPoint?: {
    x: number;
    y: number;
  };
  zIndex?: number;
  groupId?: string; // For grouping related components
  metadata?: Record<string, any>; // Additional metadata for tracking
}

// Component insertion history entry
export interface ComponentInsertionHistory {
  id: string;
  timestamp: number;
  action: 'insert' | 'remove' | 'modify' | 'move';
  componentId: string;
  instanceId: string;
  previousState?: any;
  newState?: any;
  position?: {
    x: number;
    y: number;
  };
}

// Component insertion context
export interface ComponentInsertionContext {
  cursorPosition?: {
    x: number;
    y: number;
  };
  selectedElement?: string;
  hoveredElement?: string;
  viewport?: {
    width: number;
    height: number;
    scrollX: number;
    scrollY: number;
  };
  insertionMode: 'drag-drop' | 'click-insert' | 'code-insert';
  snapToGrid?: boolean;
  snapToElements?: boolean;
  showGuides?: boolean;
}

// Component validation result
export interface ComponentValidationResult {
  isValid: boolean;
  errors: ComponentValidationError[];
  warnings: ComponentValidationWarning[];
  suggestions: string[];
}

// Enhanced validation error
export interface ComponentValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  suggestion?: string;
  location?: {
    line?: number;
    column?: number;
  };
}

// Enhanced validation warning
export interface ComponentValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
  autoFix?: boolean;
}

// Component insertion performance metrics
export interface ComponentInsertionMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  componentCount: number;
  errorCount: number;
  warningCount: number;
}

// Component insertion configuration
export interface ComponentInsertionConfig {
  maxComponents: number;
  maxHistorySize: number;
  autoSave: boolean;
  autoValidate: boolean;
  enableUndoRedo: boolean;
  enableDragDrop: boolean;
  enableSnapping: boolean;
  enableGuides: boolean;
  enableAccessibility: boolean;
  performanceMode: 'speed' | 'quality' | 'balanced';
  cacheStrategy: 'memory' | 'localStorage' | 'indexedDB';
  syncMode: 'real-time' | 'debounced' | 'manual';
}

// Component library utilities
export interface ComponentLibraryUtils {
  generateComponentId: (name: string, category: ComponentCategory) => string;
  validateProps: (component: ComponentDefinition, props: Record<string, any>) => ValidationResult;
  mergeStyles: (baseStyles: string, variantStyles?: string, customStyles?: string) => string;
  resolveDependencies: (component: ComponentDefinition) => string[];
  optimizeCode: (code: GeneratedComponentCode) => GeneratedComponentCode;
  generateTypeScriptTypes: (component: ComponentDefinition) => string;
  createPreviewImage: (component: ComponentDefinition) => Promise<string>;
  calculateComponentSize: (component: ComponentDefinition, props: Record<string, any>) => { width: number; height: number };
}

// Shadcn UI component mapping
export interface ShadcnComponentMapping {
  componentName: string;
  libraryComponent: string;
  defaultProps: Record<string, any>;
  variantMapping: Record<string, string>;
  propMapping: Record<string, string>;
  dependencies: string[];
}

// Component library extensions
export interface ComponentLibraryExtension {
  id: string;
  name: string;
  version: string;
  description?: string;
  components: ComponentDefinition[];
  hooks?: {
    onComponentLoad?: (component: ComponentDefinition) => ComponentDefinition;
    onComponentInstall?: (component: ComponentDefinition) => void;
    onComponentUninstall?: (component: ComponentDefinition) => void;
    onCodeGenerate?: (code: GeneratedComponentCode) => GeneratedComponentCode;
  };
  enabled: boolean;
}

// Component library plugin system
export interface ComponentLibraryPlugin {
  id: string;
  name: string;
  version: string;
  description?: string;
  activate: (library: UseComponentLibraryReturn) => void;
  deactivate: () => void;
  provides?: string[]; // Features or capabilities this plugin provides
  requires?: string[]; // Required features or capabilities
}

// Component library theme integration
export interface ComponentThemeIntegration {
  componentId: string;
  themeVariables: Record<string, string>;
  darkModeVariables?: Record<string, string>;
  cssCustomProperties: Record<string, string>;
  designSystemMapping: Partial<DesignSystemConfig>;
}