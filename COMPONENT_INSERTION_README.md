# Component Insertion Feature Documentation

## Overview

The Component Insertion functionality is an optional feature that adds advanced component library capabilities to the live preview system. It allows users to insert, manipulate, and manage UI components directly within the preview environment.

## Key Features

### ✅ Core Functionality

- **Smart Component Insertion**: Multiple insertion strategies (append, prepend, before, after, cursor position)
- **Design System Integration**: Automatic adaptation to your design system variables
- **Real-time Synchronization**: Instant preview updates between browser and iframe
- **Component State Management**: Track and manage component instances
- **Undo/Redo System**: Full history management with configurable depth

### ✅ Advanced Interactions

- **Drag & Drop**: Visual component manipulation with snapping
- **Resize & Move**: Interactive component editing
- **Component Selection**: Click to select and edit components
- **Keyboard Shortcuts**: Comprehensive keyboard navigation
- **Snap Guides**: Visual alignment assistance

### ✅ Developer Experience

- **TypeScript Support**: Full type safety and IntelliSense
- **Error Handling**: Comprehensive validation and recovery
- **Performance Monitoring**: Built-in performance metrics
- **Accessibility**: ARIA support and keyboard navigation
- **Documentation**: Rich examples and API reference

## Quick Start

### 1. Basic Integration

```tsx
import { ComponentInsertionWrapper, componentInsertionPresets } from '@/components/app/preview/ComponentInsertionWrapper';
import { useLivePreview } from '@/hooks/use-live-preview';
import { useDesignConfig } from '@/hooks/use-design-config';

function MyLivePreview() {
  const { config: designConfig } = useDesignConfig();
  const { state: livePreviewState, actions: livePreviewActions } = useLivePreview();

  return (
    <ComponentInsertionWrapper
      htmlContent={livePreviewState.htmlContent}
      cssContent={livePreviewState.cssContent}
      jsContent={livePreviewState.jsContent}
      designConfig={designConfig}
      onElementSelect={(element) => console.log('Element selected:', element)}
      componentInsertionConfig={componentInsertionPresets.standard}
      onComponentSelect={(instanceId) => console.log('Component selected:', instanceId)}
      onComponentMove={(instanceId, position) => {
        livePreviewActions.moveComponent(instanceId, position);
      }}
    />
  );
}
```

### 2. Using the Hook

```tsx
import { useComponentInsertion, componentInsertionPresets } from '@/components/app/preview/ComponentInsertionWrapper';

function MyComponent() {
  const {
    config,
    livePreviewState,
    livePreviewActions,
    componentLibrary,
    isEnabled
  } = useComponentInsertion(componentInsertionPresets.full);

  // Use the hook data...
}
```

### 3. Feature Toggle

```tsx
function OptionalComponentInsertion() {
  const [enabled, setEnabled] = useState(false);

  const componentInsertion = useComponentInsertion(
    enabled ? componentInsertionPresets.standard : { enabled: false }
  );

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
        Enable Component Insertion
      </label>

      <ComponentInsertionWrapper
        // ... other props
        componentInsertionConfig={componentInsertion.config}
      />
    </div>
  );
}
```

## Configuration Presets

### Available Presets

```typescript
import { componentInsertionPresets } from '@/components/app/preview/ComponentInsertionWrapper';

// Minimal - Just basic insertion capabilities
componentInsertionPresets.minimal

// Standard - Balanced features for most use cases
componentInsertionPresets.standard

// Full - All features enabled with performance monitoring
componentInsertionPresets.full

// Performance - Optimized for speed with essential features
componentInsertionPresets.performance

// Accessibility - Focused on accessibility and keyboard navigation
componentInsertionPresets.accessibility
```

### Custom Configuration

```typescript
const customConfig = {
  enabled: true,
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
  performanceMode: 'balanced' as const
};
```

## API Reference

### ComponentInsertionWrapper Props

```typescript
interface ComponentInsertionWrapperProps {
  // Core props (same as LivePreviewIframe)
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
```

### useComponentInsertion Hook

```typescript
function useComponentInsertion(config?: Partial<ComponentInsertionFeatureConfig>)

interface ReturnValue {
  config: ComponentInsertionFeatureConfig;
  livePreviewState: LivePreviewState;
  livePreviewActions: LivePreviewActions;
  componentLibrary: ComponentLibraryReturn | null;
  isEnabled: boolean;
}
```

### Enhanced useLivePreview Actions

```typescript
interface LivePreviewActions {
  // Existing actions...

  // Component insertion methods
  insertComponent: (options: ComponentInsertionOptions) => Promise<string>;
  removeComponent: (instanceId: string) => Promise<void>;
  updateComponent: (instanceId: string, updates: Partial<LivePreviewComponent>) => Promise<void>;
  moveComponent: (instanceId: string, position: { x: number; y: number }) => Promise<void>;
  duplicateComponent: (instanceId: string) => Promise<string>;
  undoComponentAction: () => Promise<void>;
  redoComponentAction: () => Promise<void>;
  getComponentAtPosition: (x: number, y: number) => string | null;
  getComponentsInArea: (startX: number, startY: number, endX: number, endY: number) => string[];
  groupComponents: (instanceIds: string[], groupId?: string) => Promise<string>;
  ungroupComponents: (groupId: string) => Promise<void>;
  validateComponentInsertion: (options: ComponentInsertionOptions) => Promise<ComponentValidationResult>;
  getInsertionHistory: () => ComponentInsertionHistory[];
  clearInsertionHistory: () => void;
  setInsertionContext: (context: ComponentInsertionContext) => void;
  getInsertionMetrics: () => ComponentInsertionMetrics;
}
```

## Integration Examples

### 1. Minimal Integration

For existing projects that want to add component insertion without major changes:

```tsx
// Replace LivePreviewIframe with ComponentInsertionWrapper
<ComponentInsertionWrapper
  {...existingProps}
  componentInsertionConfig={componentInsertionPresets.minimal}
/>
```

### 2. Full Integration

For new projects or when building component-focused tools:

```tsx
function ComponentBuilder() {
  const { config: designConfig } = useDesignConfig();
  const { state, actions } = useLivePreview();
  const componentInsertion = useComponentInsertion(componentInsertionPresets.full);

  const handleComponentInsert = async (componentId: string, position: { x: number; y: number }) => {
    try {
      const instanceId = await actions.insertComponent({
        componentId,
        position: 'cursor',
        insertionPoint: position
      });
      console.log('Component inserted:', instanceId);
    } catch (error) {
      console.error('Insertion failed:', error);
    }
  };

  return (
    <div className="component-builder">
      <ComponentLibrary onSelect={handleComponentInsert} />
      <ComponentInsertionWrapper
        htmlContent={state.htmlContent}
        cssContent={state.cssContent}
        jsContent={state.jsContent}
        designConfig={designConfig}
        componentInsertionConfig={componentInsertion.config}
        onComponentSelect={(id) => console.log('Selected:', id)}
        onComponentMove={actions.moveComponent}
      />
    </div>
  );
}
```

### 3. Conditional Loading

For applications that want to enable/disable the feature dynamically:

```tsx
function DynamicPreview({ enableComponents }: { enableComponents: boolean }) {
  const config = useMemo(() => ({
    enabled: enableComponents,
    ...componentInsertionPresets.standard
  }), [enableComponents]);

  return (
    <ComponentInsertionWrapper
      {...commonProps}
      componentInsertionConfig={config}
    />
  );
}
```

## Keyboard Shortcuts

When component insertion is enabled:

- `Ctrl/Cmd + Z`: Undo last action
- `Ctrl/Cmd + Shift + Z` or `Ctrl/Cmd + Y`: Redo last action
- `Ctrl/Cmd + D`: Duplicate selected component
- `Delete` or `Backspace`: Delete selected component
- `Escape`: Deselect current component

## Performance Considerations

### Optimization Tips

1. **Use Appropriate Presets**: Choose the preset that matches your performance needs
2. **Limit History Size**: Reduce `maxHistorySize` for memory-constrained environments
3. **Disable Unnecessary Features**: Turn off features you don't need
4. **Batch Operations**: Use `groupComponents` for bulk operations

### Performance Monitoring

```tsx
function PerformanceMonitoredPreview() {
  const { state, actions } = useLivePreview();

  useEffect(() => {
    const metrics = actions.getInsertionMetrics();
    console.log('Performance metrics:', metrics);
  }, [state.liveComponents.size]);

  // ...
}
```

## Browser Support

- **Chrome**: 88+
- **Firefox**: 85+
- **Safari**: 14+
- **Edge**: 88+

## Accessibility

The component insertion feature includes:

- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader Support**: ARIA labels and live regions
- **High Contrast Support**: Enhanced visibility for accessibility users
- **Focus Management**: Proper focus handling for interactive elements
- **Motion Sensitivity**: Respects user's motion preferences

## Troubleshooting

### Common Issues

1. **Components not appearing**: Check that `enabled: true` in your configuration
2. **Drag and drop not working**: Ensure `enableDragDrop: true` is set
3. **Performance issues**: Try the `performance` preset or reduce `maxHistorySize`
4. **TypeScript errors**: Make sure all imports are correct and types are updated

### Debug Mode

Enable debug mode by setting:

```typescript
const debugConfig = {
  ...componentInsertionPresets.standard,
  enablePerformanceMonitoring: true
};
```

This will log detailed information about component operations to the console.

## Migration Guide

### From LivePreviewIframe

1. Replace the import:

```tsx
// Before
import { LivePreviewIframe } from '@/components/app/preview/LivePreviewIframe';

// After
import { ComponentInsertionWrapper } from '@/components/app/preview/ComponentInsertionWrapper';
```

2. Update the component:

```tsx
// Before
<LivePreviewIframe {...props} />

// After
<ComponentInsertionWrapper
  {...props}
  componentInsertionConfig={componentInsertionPresets.minimal}
/>
```

3. Add component handling (optional):

```tsx
<ComponentInsertionWrapper
  {...props}
  componentInsertionConfig={componentInsertionPresets.standard}
  onComponentSelect={(id) => handleComponentSelection(id)}
  onComponentMove={(id, pos) => handleComponentMove(id, pos)}
/>
```

## Contributing

When contributing to the component insertion feature:

1. Maintain backward compatibility
2. Add appropriate TypeScript types
3. Include accessibility considerations
4. Add performance optimizations
5. Update documentation and examples
6. Test across supported browsers

## License

This feature is part of the larger application and follows the same license terms.
