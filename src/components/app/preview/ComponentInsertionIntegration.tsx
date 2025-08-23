// Component Insertion Integration Examples
// Examples of how to integrate component insertion functionality

import React, { useState } from 'react';
import { ComponentInsertionWrapper, componentInsertionPresets, useComponentInsertion } from './ComponentInsertionWrapper';
import { useLivePreview } from '@/hooks/use-live-preview';
import { useDesignConfig } from '@/hooks/use-design-config';
import { DesignSystemConfig } from '@/app/types';

interface ComponentInsertionExampleProps {
  mode: 'minimal' | 'standard' | 'full' | 'performance' | 'accessibility';
}

// Example 1: Basic integration with minimal features
export function MinimalComponentInsertionExample() {
  const { config: designConfig } = useDesignConfig();
  const { state: livePreviewState, actions: livePreviewActions } = useLivePreview();

  const handleComponentSelect = (instanceId: string | null) => {
    console.log('Component selected:', instanceId);
  };

  const handleComponentMove = (instanceId: string, position: { x: number; y: number }) => {
    console.log('Component moved:', instanceId, position);
  };

  return (
    <ComponentInsertionWrapper
      htmlContent={livePreviewState.htmlContent}
      cssContent={livePreviewState.cssContent}
      jsContent={livePreviewState.jsContent}
      designConfig={designConfig}
      onElementSelect={(element) => console.log('Element selected:', element)}
      componentInsertionConfig={componentInsertionPresets.minimal}
      onComponentSelect={handleComponentSelect}
      onComponentMove={handleComponentMove}
    />
  );
}

// Example 2: Full-featured integration
export function FullComponentInsertionExample() {
  const { config: designConfig } = useDesignConfig();
  const { state: livePreviewState, actions: livePreviewActions } = useLivePreview();
  const componentInsertion = useComponentInsertion(componentInsertionPresets.full);

  const handleComponentSelect = (instanceId: string | null) => {
    if (instanceId && componentInsertion.componentLibrary) {
      const component = componentInsertion.componentLibrary.liveComponents.get(instanceId);
      console.log('Selected component:', component);
    }
  };

  const handleComponentMove = (instanceId: string, position: { x: number; y: number }) => {
    // Update component position in your state management
    livePreviewActions.moveComponent(instanceId, position);
  };

  const handleComponentInsert = (position: { x: number; y: number }) => {
    // Handle component insertion at cursor position
    console.log('Insert component at:', position);
  };

  return (
    <div className="component-insertion-example">
      <ComponentInsertionWrapper
        htmlContent={livePreviewState.htmlContent}
        cssContent={livePreviewState.cssContent}
        jsContent={livePreviewState.jsContent}
        designConfig={designConfig}
        onElementSelect={(element) => console.log('Element selected:', element)}
        componentInsertionConfig={componentInsertionPresets.full}
        onComponentSelect={handleComponentSelect}
        onComponentMove={handleComponentMove}
        onComponentInsert={handleComponentInsert}
      />

      {/* Optional: Component insertion controls */}
      {componentInsertion.isEnabled && (
        <div className="component-insertion-controls">
          <button onClick={() => livePreviewActions.undoComponentAction()}>
            Undo
          </button>
          <button onClick={() => livePreviewActions.redoComponentAction()}>
            Redo
          </button>
          <div className="insertion-metrics">
            <span>Components: {livePreviewState.liveComponents.size}</span>
            <span>History: {livePreviewState.insertionHistory.length}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Example 3: Conditional integration based on feature flags
export function ConditionalComponentInsertionExample() {
  const [isComponentInsertionEnabled, setIsComponentInsertionEnabled] = useState(false);
  const { config: designConfig } = useDesignConfig();
  const { state: livePreviewState, actions: livePreviewActions } = useLivePreview();

  const componentInsertion = useComponentInsertion(
    isComponentInsertionEnabled ? componentInsertionPresets.standard : { enabled: false }
  );

  return (
    <div className="conditional-example">
      <div className="feature-toggle">
        <label>
          <input
            type="checkbox"
            checked={isComponentInsertionEnabled}
            onChange={(e) => setIsComponentInsertionEnabled(e.target.checked)}
          />
          Enable Component Insertion
        </label>
      </div>

      <ComponentInsertionWrapper
        htmlContent={livePreviewState.htmlContent}
        cssContent={livePreviewState.cssContent}
        jsContent={livePreviewState.jsContent}
        designConfig={designConfig}
        onElementSelect={(element) => console.log('Element selected:', element)}
        componentInsertionConfig={componentInsertion.config}
        onComponentSelect={(instanceId) => {
          if (componentInsertion.componentLibrary) {
            // Handle component selection
          }
        }}
        onComponentMove={(instanceId, position) => {
          livePreviewActions.moveComponent(instanceId, position);
        }}
      />
    </div>
  );
}

// Example 4: Integration with existing component library browser
export function ComponentLibraryIntegrationExample() {
  const { config: designConfig } = useDesignConfig();
  const { state: livePreviewState, actions: livePreviewActions } = useLivePreview();
  const componentInsertion = useComponentInsertion(componentInsertionPresets.standard);

  const handleComponentDragStart = (componentId: string) => {
    // Set up drag data
    console.log('Starting drag for component:', componentId);
  };

  const handleComponentDrop = async (componentId: string, position: { x: number; y: number }) => {
    if (componentInsertion.componentLibrary) {
      try {
        const instanceId = await livePreviewActions.insertComponent({
          componentId,
          position: 'cursor',
          insertionPoint: position
        });
        console.log('Component inserted:', instanceId);
      } catch (error) {
        console.error('Failed to insert component:', error);
      }
    }
  };

  return (
    <div className="library-integration-example">
      <div className="component-palette">
        {componentInsertion.componentLibrary?.state.components && (
          Array.from(componentInsertion.componentLibrary.state.components.values()).map(component => (
            <div
              key={component.metadata.id}
              className="component-item"
              draggable
              onDragStart={() => handleComponentDragStart(component.metadata.id)}
              onDragEnd={() => handleComponentDrop(component.metadata.id, { x: 100, y: 100 })}
            >
              <h4>{component.metadata.name}</h4>
              <p>{component.metadata.description}</p>
            </div>
          ))
        )}
      </div>

      <ComponentInsertionWrapper
        htmlContent={livePreviewState.htmlContent}
        cssContent={livePreviewState.cssContent}
        jsContent={livePreviewState.jsContent}
        designConfig={designConfig}
        onElementSelect={(element) => console.log('Element selected:', element)}
        componentInsertionConfig={componentInsertion.config}
        onComponentSelect={(instanceId) => {
          // Handle component selection from preview
        }}
        onComponentMove={(instanceId, position) => {
          livePreviewActions.moveComponent(instanceId, position);
        }}
        onComponentInsert={(position) => {
          // Handle insertion at cursor position
          console.log('Insert at position:', position);
        }}
      />
    </div>
  );
}

// Example 5: Integration with keyboard shortcuts
export function KeyboardShortcutIntegrationExample() {
  const { config: designConfig } = useDesignConfig();
  const { state: livePreviewState, actions: livePreviewActions } = useLivePreview();
  const componentInsertion = useComponentInsertion(componentInsertionPresets.standard);

  // Add keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!componentInsertion.isEnabled) return;

      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'z':
            event.preventDefault();
            if (event.shiftKey) {
              livePreviewActions.redoComponentAction();
            } else {
              livePreviewActions.undoComponentAction();
            }
            break;
          case 'y':
            event.preventDefault();
            livePreviewActions.redoComponentAction();
            break;
          case 's':
            event.preventDefault();
            console.log('Save components:', Array.from(livePreviewState.liveComponents.entries()));
            break;
        }
      }

      if (event.key === 'Delete' || event.key === 'Backspace') {
        // Delete selected component
        const selectedElement = livePreviewState.selectedElement;
        if (selectedElement && selectedElement.startsWith('component-')) {
          event.preventDefault();
          livePreviewActions.removeComponent(selectedElement);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [componentInsertion.isEnabled, livePreviewActions, livePreviewState]);

  return (
    <ComponentInsertionWrapper
      htmlContent={livePreviewState.htmlContent}
      cssContent={livePreviewState.cssContent}
      jsContent={livePreviewState.jsContent}
      designConfig={designConfig}
      onElementSelect={(element) => {
        livePreviewActions.setSelectedElement(element);
      }}
      componentInsertionConfig={componentInsertion.config}
      onComponentSelect={(instanceId) => {
        livePreviewActions.setSelectedElement(instanceId);
      }}
      onComponentMove={livePreviewActions.moveComponent}
    />
  );
}

// Configuration for different integration scenarios
export const integrationExamples = {
  // For existing projects that want minimal disruption
  'existing-project': {
    wrapper: MinimalComponentInsertionExample,
    description: 'Minimal integration that maintains existing functionality',
    features: ['Basic insertion', 'Undo/Redo', 'Component selection']
  },

  // For new projects or major updates
  'new-project': {
    wrapper: FullComponentInsertionExample,
    description: 'Full-featured integration with all capabilities',
    features: ['All features enabled', 'Performance monitoring', 'Advanced controls']
  },

  // For projects that want to gradually adopt features
  'gradual-adoption': {
    wrapper: ConditionalComponentInsertionExample,
    description: 'Feature-flag based integration for gradual rollout',
    features: ['Runtime toggling', 'Backward compatibility', 'Safe migration']
  },

  // For design tools and component libraries
  'design-tool': {
    wrapper: ComponentLibraryIntegrationExample,
    description: 'Integration optimized for design tools',
    features: ['Drag and drop', 'Component palette', 'Visual feedback']
  },

  // For accessibility-focused applications
  'accessibility': {
    wrapper: KeyboardShortcutIntegrationExample,
    description: 'Integration focused on accessibility and keyboard navigation',
    features: ['Keyboard shortcuts', 'Screen reader support', 'High contrast mode']
  }
};