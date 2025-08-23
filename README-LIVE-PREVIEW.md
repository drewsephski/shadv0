# Live Preview Panel Enhancement

This enhancement adds real-time live preview and editing capabilities to the existing preview panel, providing a powerful dual-view interface for instant design feedback and code synchronization.

## Features

### 🎨 Real-Time Design Controls

- **Live Color Editing**: Adjust colors with instant visual feedback
- **Typography Controls**: Modify fonts, sizes, and spacing in real-time
- **Component Styling**: Change button styles, card variants, and layout options
- **CSS Variable Injection**: Automatic CSS variable generation and application

### 🔄 Bidirectional Sync

- **Code to Preview**: Changes in code editor instantly reflect in preview
- **Preview to Code**: Visual changes can be synced back to code (planned)
- **Debounced Updates**: Optimized performance with intelligent update throttling
- **Change Tracking**: Visual indicators for unsaved changes

### 📱 Responsive Viewports

- **Desktop View**: Full-width preview with realistic desktop dimensions
- **Tablet View**: 768px max-width simulation
- **Mobile View**: 375px max-width simulation with mobile-first considerations

### ⚡ Advanced Features

- **Element Selection**: Click elements in preview to highlight corresponding code
- **Keyboard Shortcuts**: Quick access to common actions (Ctrl+S to save, etc.)
- **Fullscreen Mode**: Distraction-free editing experience
- **Split View**: Side-by-side code and preview for maximum productivity

## Components Created

### 1. `useLivePreview` Hook (`src/hooks/use-live-preview.ts`)

State management for live preview functionality with:

- HTML, CSS, and JavaScript content management
- Design configuration state
- Real-time synchronization logic
- CSS variable generation

### 2. `LivePreviewEditor` Component (`src/components/app/preview/LivePreviewEditor.tsx`)

Main dual-view interface featuring:

- Code editor with syntax highlighting (HTML/CSS/JS tabs)
- Live preview iframe with design controls
- Viewport switching and fullscreen capabilities
- Real-time sync between code and preview

### 3. `LivePreviewIframe` Component (`src/components/app/preview/LivePreviewIframe.tsx`)

Advanced iframe wrapper with:

- CSS variable injection
- Element selection and highlighting
- Message passing between parent and iframe
- Interactive element detection

### 4. `DesignControlsPanel` Component (`src/components/app/preview/DesignControlsPanel.tsx`)

Comprehensive design control interface with:

- Color picker and preset selection
- Typography controls (fonts, sizes, weights)
- Component variant selection
- Advanced mode for detailed customization

## Enhanced PreviewPanel

The existing `PreviewPanel` component has been enhanced with:

- Optional live editing mode (`enableLiveEditing` prop)
- Live edit callback support (`onLiveEdit` prop)
- Seamless integration with existing refinement workflow
- Toggle between traditional and live editing modes

## Usage Examples

### Basic Implementation

```tsx
import { PreviewPanel } from '@/components/app/preview/PreviewPanel';

function MyComponent() {
  const [htmlContent, setHtmlContent] = useState('<h1>Hello World</h1>');

  const handleLiveEdit = (html: string, config: DesignSystemConfig) => {
    console.log('Live edit:', { html, config });
    // Handle the live edits here
  };

  return (
    <PreviewPanel
      dataUrl={`data:text/html,${encodeURIComponent(htmlContent)}`}
      htmlContent={htmlContent}
      onRefineCode={(code) => console.log('Refine code:', code)}
      enableLiveEditing={true}
      onLiveEdit={handleLiveEdit}
    />
  );
}
```

### Advanced Implementation with Full State Management

```tsx
import { LivePreviewEditor } from '@/components/app/preview/LivePreviewEditor';
import { useLivePreview } from '@/hooks/use-live-preview';

function AdvancedEditor() {
  const { state, actions } = useLivePreview(initialHTML, initialDesignConfig);

  return (
    <div className="h-screen">
      <LivePreviewEditor
        initialHTML={initialHTML}
        initialDesignConfig={initialDesignConfig}
        onHTMLChange={(html) => {
          // Handle HTML changes
          console.log('HTML updated:', html);
        }}
        onDesignChange={(config) => {
          // Handle design config changes
          console.log('Design updated:', config);
        }}
      />

      {/* Additional controls or status */}
      <div className="fixed bottom-4 right-4">
        {state.isDirty && (
          <span className="text-sm text-orange-600">Unsaved changes</span>
        )}
      </div>
    </div>
  );
}
```

## Keyboard Shortcuts

When in live editing mode:

- `Ctrl + S` / `Cmd + S`: Save current changes
- `Ctrl + Z` / `Cmd + Z`: Undo last change
- `Ctrl + Shift + Z` / `Cmd + Shift + Z`: Redo last undone change
- `Escape`: Exit fullscreen mode (when active)

## API Reference

### useLivePreview Hook

```typescript
const { state, actions, iframeRef } = useLivePreview(initialHTML, initialDesignConfig);
```

**State Properties:**

- `htmlContent: string` - Current HTML content
- `cssContent: string` - Current CSS content
- `jsContent: string` - Current JavaScript content
- `designConfig: DesignSystemConfig` - Current design configuration
- `isEditing: boolean` - Whether in editing mode
- `activeView: 'code' | 'preview' | 'split'` - Current view mode
- `selectedElement: string | null` - Currently selected element
- `isDirty: boolean` - Whether there are unsaved changes

**Actions:**

- `updateHTML(html: string)` - Update HTML content
- `updateCSS(css: string)` - Update CSS content
- `updateJS(js: string)` - Update JavaScript content
- `updateDesignConfig(config: DesignSystemConfig)` - Update design config
- `setActiveView(view)` - Change active view
- `setSelectedElement(element)` - Select an element
- `setEditing(editing)` - Toggle editing mode
- `markDirty(dirty)` - Mark as dirty/clean
- `reset()` - Reset to initial state
- `applyDesignChange(property, value)` - Apply design change
- `injectCSSVariables()` - Generate CSS variables string
- `syncChanges()` - Sync changes to preview

### LivePreviewEditor Props

```typescript
interface LivePreviewEditorProps {
  initialHTML?: string;
  initialDesignConfig?: DesignSystemConfig;
  onHTMLChange?: (html: string) => void;
  onDesignChange?: (config: DesignSystemConfig) => void;
  className?: string;
}
```

### Enhanced PreviewPanel Props

```typescript
interface PreviewPanelProps {
  // ... existing props
  enableLiveEditing?: boolean;
  onLiveEdit?: (html: string, config: DesignSystemConfig) => void;
}
```

## Design System Integration

The live preview system integrates seamlessly with the existing design system:

### Color Management

- Real-time color picker with hex input
- Predefined color presets (Blue, Green, Purple)
- CSS custom property generation
- Automatic contrast calculation

### Typography System

- Font family selection (Inter, Lato)
- Responsive font size scales
- Font weight controls
- Line height and letter spacing

### Component Variants

- Button styles (rounded, square, pill, ghost, outline)
- Card variants (flat, elevated, glass, bordered)
- Input types (default, floating, minimal, material)
- Modal animations (default, fullscreen, slide, fade)

## Performance Optimizations

### Debounced Updates

Changes are debounced to prevent excessive iframe reloads and improve performance.

### CSS Variable Injection

Design changes are injected as CSS variables rather than regenerating the entire document.

### Efficient Rendering

- Virtual scrolling for large code content
- Optimized iframe communication
- Lazy loading of preview content

## Browser Compatibility

- **Chrome/Edge**: Full support including advanced features
- **Firefox**: Full support with minor iframe limitations
- **Safari**: Full support (iOS 12.2+ recommended)
- **Mobile Browsers**: Responsive design with touch-friendly controls

## Troubleshooting

### Common Issues

1. **Preview not updating**: Check if iframe is loaded and CSS variables are properly injected
2. **Element selection not working**: Ensure iframe has proper sandbox permissions
3. **Design changes not applying**: Verify CSS variable names match the design system
4. **Performance issues**: Check if debouncing is working and reduce update frequency if needed

### Debug Mode

Enable debug mode by adding `?debug=true` to the URL to see:

- CSS variable injection logs
- Iframe communication messages
- Performance metrics
- Error tracking

## Future Enhancements

### Planned Features

- **Visual Element Inspector**: Click elements to edit properties directly
- **Component Library Integration**: Drag and drop components from library
- **Version History**: Track and revert design changes
- **Collaborative Editing**: Real-time collaboration features
- **Export Options**: Enhanced export with multiple formats
- **Theme Builder**: Advanced theme creation and management

### Potential Integrations

- **Design Tokens**: Integration with design token systems
- **Style Guides**: Automatic style guide generation
- **Accessibility Testing**: Built-in accessibility checks
- **Performance Monitoring**: CSS and JS performance metrics

## Contributing

When contributing to the live preview system:

1. Maintain backward compatibility with existing PreviewPanel usage
2. Follow the established design system patterns
3. Add comprehensive TypeScript types
4. Include performance considerations
5. Test across different browsers and devices
6. Update documentation for new features

## License

This enhancement follows the same license as the main project.
