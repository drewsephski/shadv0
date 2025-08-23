"use client";

import { forwardRef, useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { DesignSystemConfig } from '@/app/types';

interface LivePreviewIframeProps {
  htmlContent: string;
  cssContent: string;
  jsContent: string;
  designConfig: DesignSystemConfig;
  onElementSelect?: (element: string | null) => void;
  onComponentSelect?: (instanceId: string | null) => void;
  onComponentMove?: (instanceId: string, position: { x: number; y: number }) => void;
  onComponentInsert?: (position: { x: number; y: number }) => void;
  liveComponents?: Map<string, any>; // Component instances
  insertionContext?: any; // Insertion context  
  className?: string;
}

export const LivePreviewIframe = forwardRef<HTMLIFrameElement, LivePreviewIframeProps>(
  function LivePreviewIframeComponent({
    htmlContent,
    cssContent,
    jsContent,
    designConfig,
    onElementSelect,
    onComponentSelect,
    onComponentMove,
    onComponentInsert,
    liveComponents = new Map(),
    insertionContext,
    className
  }, ref) {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
    const [components, setComponents] = useState<Map<string, any>>(liveComponents);
    const [componentState, setComponentState] = useState<any>({});
        
    // Generate CSS variables from design config
    const generateCSSVariables = useCallback(() => {
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
      return `
        :root {
          ${Object.entries(cssVars)
            .map(([key, value]) => `${key}: ${value};`)
            .join('\n          ')}
        }

        * {
          box-sizing: border-box;
        }

        body {
          font-family: var(--font-family-primary), system-ui, -apple-system, sans-serif;
          background-color: var(--color-background);
          color: var(--color-text);
          margin: 0;
          padding: var(--spacing-md);
          line-height: var(--line-height-normal);
        }

        /* Interactive elements styling */
        button, input, select, textarea {
          font-family: inherit;
        }

        button {
          background-color: var(--color-primary);
          color: white;
          border: none;
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--border-radius-md);
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        button:hover {
          background-color: var(--color-secondary);
        }

        input, textarea {
          border: 1px solid var(--color-border);
          padding: var(--spacing-sm);
          border-radius: var(--border-radius-md);
          background-color: var(--color-surface);
          color: var(--color-text);
        }

        input:focus, textarea:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 2px var(--color-primary)20;
        }

        /* Hover and selection styles for element selection */
        .live-preview-hover {
          outline: 2px solid var(--color-primary) !important;
          outline-offset: 2px;
        }

        .live-preview-selected {
          outline: 3px solid var(--color-accent) !important;
          outline-offset: 2px;
          background-color: var(--color-primary)10 !important;
        }

        /* Component interaction styles */
        .live-component-wrapper {
          position: relative;
          transition: all 0.2s ease;
        }

        .live-component-wrapper:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .live-component-wrapper.live-component-selected {
          outline: 3px solid var(--color-accent) !important;
          outline-offset: 2px;
          z-index: 1000;
        }

        .live-component-wrapper.live-component-dragging {
          opacity: 0.7;
          transform: rotate(5deg);
          z-index: 1001;
        }

        .live-component-wrapper.live-component-resizing {
          user-select: none;
        }

        /* Drag and drop overlay */
        .component-drop-zone {
          position: absolute;
          border: 2px dashed var(--color-primary);
          background-color: var(--color-primary)10;
          pointer-events: none;
          z-index: 999;
        }

        .component-drop-zone.valid {
          border-color: var(--color-success);
          background-color: var(--color-success)10;
        }

        .component-drop-zone.invalid {
          border-color: var(--color-error);
          background-color: var(--color-error)10;
        }

        /* Resize handles */
        .component-resize-handle {
          position: absolute;
          width: 8px;
          height: 8px;
          background-color: var(--color-primary);
          border-radius: 50%;
          cursor: pointer;
          z-index: 1002;
        }

        .component-resize-handle.nw { top: -4px; left: -4px; cursor: nw-resize; }
        .component-resize-handle.ne { top: -4px; right: -4px; cursor: ne-resize; }
        .component-resize-handle.sw { bottom: -4px; left: -4px; cursor: sw-resize; }
        .component-resize-handle.se { bottom: -4px; right: -4px; cursor: se-resize; }
        .component-resize-handle.n { top: -4px; left: 50%; margin-left: -4px; cursor: n-resize; }
        .component-resize-handle.s { bottom: -4px; left: 50%; margin-left: -4px; cursor: s-resize; }
        .component-resize-handle.w { left: -4px; top: 50%; margin-top: -4px; cursor: w-resize; }
        .component-resize-handle.e { right: -4px; top: 50%; margin-top: -4px; cursor: e-resize; }

        /* Snap guides */
        .component-snap-guide {
          position: absolute;
          background-color: var(--color-accent);
          pointer-events: none;
          z-index: 1003;
        }

        .component-snap-guide.horizontal {
          height: 1px;
          width: 100%;
        }

        .component-snap-guide.vertical {
          width: 1px;
          height: 100%;
        }

        /* Component toolbar */
        .component-toolbar {
          position: absolute;
          top: -40px;
          left: 0;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-md);
          padding: var(--spacing-xs);
          display: none;
          z-index: 1004;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .live-component-wrapper:hover .component-toolbar {
          display: flex;
        }

        .component-toolbar button {
          background: transparent;
          border: none;
          padding: var(--spacing-xs);
          margin: 0 var(--spacing-xs);
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          font-size: 12px;
        }

        .component-toolbar button:hover {
          background: var(--color-primary)20;
        }
      `;
    }, [designConfig]);

    // Generate the complete HTML document
    const generateDocumentContent = useCallback(() => {
      const cssVariables = generateCSSVariables();

      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Live Preview</title>
            <style>
                ${cssVariables}
                ${cssContent}
            </style>
        </head>
        <body>
            ${htmlContent}

            <!-- Enhanced Component Interaction Script -->
            <script>
                let selectedElement = null;
                let hoveredElement = null;
                let selectedComponent = null;
                let draggedComponent = null;
                let isDragging = false;
                let dragOffset = { x: 0, y: 0 };
                let dropZones = [];
                let snapGuides = [];
                let components = ${JSON.stringify(Array.from(liveComponents.entries()))};

                // Component interaction state
                let componentState = {
                    insertionMode: '${insertionContext?.insertionMode || 'click-insert'}',
                    snapToGrid: ${insertionContext?.snapToGrid || false},
                    snapToElements: ${insertionContext?.snapToElements || false},
                    showGuides: ${insertionContext?.showGuides || false},
                    gridSize: 10,
                    snapThreshold: 5
                };

                function removeHoverEffect() {
                    if (hoveredElement && hoveredElement !== selectedElement) {
                        hoveredElement.classList.remove('live-preview-hover');
                        hoveredElement = null;
                    }
                }

                function removeSelectionEffect() {
                    if (selectedElement) {
                        selectedElement.classList.remove('live-preview-selected');
                        selectedElement = null;
                    }
                }

                function removeComponentSelection() {
                    if (selectedComponent) {
                        selectedComponent.classList.remove('live-component-selected');
                        selectedComponent = null;
                    }
                }

                // Component selection
                function selectComponent(component) {
                    removeComponentSelection();
                    selectedComponent = component;
                    selectedComponent.classList.add('live-component-selected');
                    addResizeHandles(component);
                    addComponentToolbar(component);

                    window.parent.postMessage({
                        type: 'COMPONENT_SELECTED',
                        instanceId: component.id,
                        componentData: getComponentData(component)
                    }, '*');
                }

                function getComponentData(component) {
                    const rect = component.getBoundingClientRect();
                    return {
                        instanceId: component.id,
                        position: {
                            x: component.offsetLeft,
                            y: component.offsetTop
                        },
                        size: {
                            width: rect.width,
                            height: rect.height
                        },
                        component: components.find(([id]) => id === component.id)?.[1]
                    };
                }

                // Add resize handles to component
                function addResizeHandles(component) {
                    const existingHandles = component.querySelectorAll('.component-resize-handle');
                    existingHandles.forEach(handle => handle.remove());

                    const handles = ['nw', 'ne', 'sw', 'se', 'n', 's', 'w', 'e'];
                    handles.forEach(position => {
                        const handle = document.createElement('div');
                        handle.className = \`component-resize-handle \${position}\`;
                        handle.addEventListener('mousedown', startResize.bind(null, component, position));
                        component.appendChild(handle);
                    });
                }

                // Add component toolbar
                function addComponentToolbar(component) {
                    const existingToolbar = component.querySelector('.component-toolbar');
                    if (existingToolbar) return;

                    const toolbar = document.createElement('div');
                    toolbar.className = 'component-toolbar';
                    toolbar.innerHTML = \`
                        <button title="Edit" onclick="editComponent('\${component.id}')">✏️</button>
                        <button title="Duplicate" onclick="duplicateComponent('\${component.id}')">📋</button>
                        <button title="Delete" onclick="deleteComponent('\${component.id}')">🗑️</button>
                        <button title="Move to Front" onclick="moveComponent('\${component.id}', 'front')">⬆️</button>
                        <button title="Move to Back" onclick="moveComponent('\${component.id}', 'back')">⬇️</button>
                    \`;
                    component.appendChild(toolbar);
                }

                // Component event handlers
                function startResize(component, position, e) {
                    e.stopPropagation();
                    e.preventDefault();

                    const startX = e.clientX;
                    const startY = e.clientY;
                    const startRect = component.getBoundingClientRect();

                    component.classList.add('live-component-resizing');

                    function handleMouseMove(e) {
                        const deltaX = e.clientX - startX;
                        const deltaY = e.clientY - startY;

                        let newWidth = startRect.width;
                        let newHeight = startRect.height;
                        let newLeft = component.offsetLeft;
                        let newTop = component.offsetTop;

                        if (position.includes('e')) newWidth = startRect.width + deltaX;
                        if (position.includes('w')) {
                            newWidth = startRect.width - deltaX;
                            newLeft = component.offsetLeft + deltaX;
                        }
                        if (position.includes('s')) newHeight = startRect.height + deltaY;
                        if (position.includes('n')) {
                            newHeight = startRect.height - deltaY;
                            newTop = component.offsetTop + deltaY;
                        }

                        component.style.width = \`\${Math.max(50, newWidth)}px\`;
                        component.style.height = \`\${Math.max(30, newHeight)}px\`;
                        if (position.includes('w') || position.includes('n')) {
                            component.style.left = \`\${newLeft}px\`;
                            component.style.top = \`\${newTop}px\`;
                        }
                    }

                    function handleMouseUp() {
                        component.classList.remove('live-component-resizing');
                        document.removeEventListener('mousemove', handleMouseMove);
                        document.removeEventListener('mouseup', handleMouseUp);

                        window.parent.postMessage({
                            type: 'COMPONENT_RESIZED',
                            instanceId: component.id,
                            newBounds: getComponentData(component)
                        }, '*');
                    }

                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                }

                // Drag and drop functionality
                function makeDraggable(component) {
                    component.addEventListener('mousedown', startDrag.bind(null, component));
                }

                function startDrag(component, e) {
                    if (e.target.classList.contains('component-resize-handle') ||
                        e.target.closest('.component-toolbar')) {
                        return;
                    }

                    e.preventDefault();
                    e.stopPropagation();

                    isDragging = true;
                    draggedComponent = component;
                    dragOffset.x = e.clientX - component.offsetLeft;
                    dragOffset.y = e.clientY - component.offsetTop;

                    component.classList.add('live-component-dragging');

                    document.addEventListener('mousemove', handleDrag);
                    document.addEventListener('mouseup', stopDrag);
                }

                function handleDrag(e) {
                    if (!isDragging || !draggedComponent) return;

                    let newLeft = e.clientX - dragOffset.x;
                    let newTop = e.clientY - dragOffset.y;

                    // Snap to grid if enabled
                    if (componentState.snapToGrid) {
                        newLeft = Math.round(newLeft / componentState.gridSize) * componentState.gridSize;
                        newTop = Math.round(newTop / componentState.gridSize) * componentState.gridSize;
                    }

                    // Snap to elements if enabled
                    if (componentState.snapToElements) {
                        const snapResult = calculateSnapPosition(draggedComponent, newLeft, newTop);
                        newLeft = snapResult.x;
                        newTop = snapResult.y;
                    }

                    draggedComponent.style.left = \`\${newLeft}px\`;
                    draggedComponent.style.top = \`\${newTop}px\`;

                    if (componentState.showGuides) {
                        updateSnapGuides(draggedComponent, newLeft, newTop);
                    }
                }

                function stopDrag() {
                    if (!draggedComponent) return;

                    isDragging = false;
                    draggedComponent.classList.remove('live-component-dragging');
                    clearSnapGuides();

                    window.parent.postMessage({
                        type: 'COMPONENT_MOVED',
                        instanceId: draggedComponent.id,
                        newPosition: {
                            x: draggedComponent.offsetLeft,
                            y: draggedComponent.offsetTop
                        }
                    }, '*');

                    draggedComponent = null;

                    document.removeEventListener('mousemove', handleDrag);
                    document.removeEventListener('mouseup', stopDrag);
                }

                // Snap positioning
                function calculateSnapPosition(component, x, y) {
                    const snapThreshold = componentState.snapThreshold;
                    const otherComponents = Array.from(document.querySelectorAll('.live-component-wrapper'))
                        .filter(c => c !== component);

                    let snappedX = x;
                    let snappedY = y;

                    otherComponents.forEach(other => {
                        const otherRect = other.getBoundingClientRect();
                        const componentRect = component.getBoundingClientRect();

                        // Horizontal snapping
                        if (Math.abs(componentRect.left - otherRect.right) < snapThreshold) {
                            snappedX = other.offsetLeft + other.offsetWidth;
                        } else if (Math.abs(componentRect.right - otherRect.left) < snapThreshold) {
                            snappedX = other.offsetLeft - component.offsetWidth;
                        }

                        // Vertical snapping
                        if (Math.abs(componentRect.top - otherRect.bottom) < snapThreshold) {
                            snappedY = other.offsetTop + other.offsetHeight;
                        } else if (Math.abs(componentRect.bottom - otherRect.top) < snapThreshold) {
                            snappedY = other.offsetTop - component.offsetHeight;
                        }
                    });

                    return { x: snappedX, y: snappedY };
                }

                // Snap guides
                function updateSnapGuides(component, x, y) {
                    clearSnapGuides();

                    const otherComponents = Array.from(document.querySelectorAll('.live-component-wrapper'))
                        .filter(c => c !== component);

                    otherComponents.forEach(other => {
                        const otherRect = other.getBoundingClientRect();

                        // Check for alignment
                        if (Math.abs(x - other.offsetLeft) < componentState.snapThreshold) {
                            createSnapGuide('vertical', other.offsetLeft, 0, window.innerHeight);
                        }
                        if (Math.abs(y - other.offsetTop) < componentState.snapThreshold) {
                            createSnapGuide('horizontal', 0, other.offsetTop, window.innerWidth);
                        }
                    });
                }

                function createSnapGuide(type, x, y, length) {
                    const guide = document.createElement('div');
                    guide.className = \`component-snap-guide \${type}\`;
                    guide.style.left = \`\${x}px\`;
                    guide.style.top = \`\${y}px\`;
                    if (type === 'vertical') {
                        guide.style.width = '1px';
                        guide.style.height = \`\${length}px\`;
                    } else {
                        guide.style.width = \`\${length}px\`;
                        guide.style.height = '1px';
                    }
                    document.body.appendChild(guide);
                    snapGuides.push(guide);
                }

                function clearSnapGuides() {
                    snapGuides.forEach(guide => guide.remove());
                    snapGuides = [];
                }

                // Global event handlers
                document.addEventListener('mouseover', (e) => {
                    if (e.target === document.body || isDragging) return;

                    const component = e.target.closest('.live-component-wrapper');
                    if (component) {
                        removeHoverEffect();
                        hoveredElement = component;
                        if (hoveredElement !== selectedElement) {
                            hoveredElement.classList.add('live-preview-hover');
                        }
                    } else {
                        removeHoverEffect();
                    }
                });

                document.addEventListener('mouseout', (e) => {
                    if (e.target === hoveredElement) {
                        removeHoverEffect();
                    }
                });

                document.addEventListener('click', (e) => {
                    if (isDragging) return;

                    const component = e.target.closest('.live-component-wrapper');
                    if (component) {
                        e.preventDefault();
                        e.stopPropagation();
                        selectComponent(component);
                    } else {
                        removeComponentSelection();
                        // Fallback to element selection
                        removeSelectionEffect();
                        selectedElement = e.target;
                        selectedElement.classList.add('live-preview-selected');

                        window.parent.postMessage({
                            type: 'ELEMENT_SELECTED',
                            selector: getElementSelector(e.target),
                            outerHTML: e.target.outerHTML
                        }, '*');
                    }
                });

                document.addEventListener('dblclick', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const component = e.target.closest('.live-component-wrapper');
                    if (component) {
                        window.parent.postMessage({
                            type: 'COMPONENT_DOUBLE_CLICKED',
                            instanceId: component.id,
                            componentData: getComponentData(component)
                        }, '*');
                    } else {
                        window.parent.postMessage({
                            type: 'ELEMENT_DOUBLE_CLICKED',
                            selector: getElementSelector(e.target),
                            outerHTML: e.target.outerHTML
                        }, '*');
                    }
                });

                function getElementSelector(element) {
                    if (element.id) {
                        return '#' + element.id;
                    }

                    if (element.className) {
                        return '.' + element.className.split(' ').filter(c => c && !c.startsWith('live-preview-') && !c.startsWith('component-')).join('.');
                    }

                    const tagName = element.tagName.toLowerCase();
                    const siblings = Array.from(element.parentNode?.children || []);
                    const index = siblings.indexOf(element) + 1;

                    return \`\${tagName}:nth-child(\${index})\`;
                }

                // Component action functions
                function editComponent(instanceId) {
                    window.parent.postMessage({
                        type: 'COMPONENT_EDIT_REQUESTED',
                        instanceId
                    }, '*');
                }

                function duplicateComponent(instanceId) {
                    window.parent.postMessage({
                        type: 'COMPONENT_DUPLICATE_REQUESTED',
                        instanceId
                    }, '*');
                }

                function deleteComponent(instanceId) {
                    if (confirm('Are you sure you want to delete this component?')) {
                        window.parent.postMessage({
                            type: 'COMPONENT_DELETE_REQUESTED',
                            instanceId
                        }, '*');
                    }
                }

                function moveComponent(instanceId, direction) {
                    window.parent.postMessage({
                        type: 'COMPONENT_MOVE_LAYER_REQUESTED',
                        instanceId,
                        direction
                    }, '*');
                }

                // Initialize components
                function initializeComponents() {
                    components.forEach(([instanceId, componentData]) => {
                        const element = document.getElementById(instanceId);
                        if (element) {
                            makeDraggable(element);
                            if (componentData.position) {
                                element.style.position = 'absolute';
                                element.style.left = \`\${componentData.position.x}px\`;
                                element.style.top = \`\${componentData.position.y}px\`;
                            }
                        }
                    });
                }

                // Keyboard shortcuts
                document.addEventListener('keydown', (e) => {
                    if (e.ctrlKey || e.metaKey) {
                        switch (e.key) {
                            case 's':
                                e.preventDefault();
                                window.parent.postMessage({ type: 'SAVE_REQUESTED' }, '*');
                                break;
                            case 'z':
                                if (e.shiftKey) {
                                    e.preventDefault();
                                    window.parent.postMessage({ type: 'REDO_REQUESTED' }, '*');
                                } else {
                                    e.preventDefault();
                                    window.parent.postMessage({ type: 'UNDO_REQUESTED' }, '*');
                                }
                                break;
                            case 'd':
                                e.preventDefault();
                                if (selectedComponent) {
                                    duplicateComponent(selectedComponent.id);
                                }
                                break;
                            case 'Delete':
                            case 'Backspace':
                                e.preventDefault();
                                if (selectedComponent) {
                                    deleteComponent(selectedComponent.id);
                                }
                                break;
                        }
                    }

                    if (e.key === 'Escape') {
                        removeComponentSelection();
                    }
                });

                // Handle messages from parent
                window.addEventListener('message', (event) => {
                    if (event.data.type === 'UPDATE_COMPONENT_CONTEXT') {
                        componentState = { ...componentState, ...event.data.context };
                    } else if (event.data.type === 'REFRESH_COMPONENTS') {
                        components = event.data.components;
                        initializeComponents();
                    }
                });

                // Resize observer for responsive design testing
                const resizeObserver = new ResizeObserver((entries) => {
                    window.parent.postMessage({
                        type: 'CONTENT_RESIZED',
                        dimensions: {
                            width: entries[0].contentRect.width,
                            height: entries[0].contentRect.height
                        }
                    }, '*');
                });

                resizeObserver.observe(document.body);

                // Initialize when DOM is ready
                document.addEventListener('DOMContentLoaded', () => {
                    initializeComponents();
                });
            </script>

            <!-- User JavaScript -->
            <script>
                ${jsContent}
            </script>
        </body>
        </html>
      `.trim();
    }, [htmlContent, cssContent, jsContent, generateCSSVariables]);

    // Handle iframe load
    const handleIframeLoad = useCallback(() => {
      setIsLoading(false);

      // Setup message listener for parent communication
      const handleMessage = (event: MessageEvent) => {
        // Ensure the message is from our iframe
        if (event.source === (ref as any)?.current?.contentWindow) {
          switch (event.data.type) {
            case 'ELEMENT_SELECTED':
              if (onElementSelect) {
                onElementSelect(event.data.outerHTML);
              }
              break;
            case 'ELEMENT_DOUBLE_CLICKED':
              // Handle double-click for editing
              console.log('Element double-clicked:', event.data);
              break;
            case 'COMPONENT_SELECTED':
              if (onComponentSelect) {
                onComponentSelect(event.data.instanceId);
              }
              break;
            case 'COMPONENT_DOUBLE_CLICKED':
              // Handle component double-click for editing
              console.log('Component double-clicked:', event.data);
              break;
            case 'COMPONENT_MOVED':
              if (onComponentMove) {
                onComponentMove(event.data.instanceId, event.data.newPosition);
              }
              break;
            case 'COMPONENT_RESIZED':
              // Handle component resize
              console.log('Component resized:', event.data);
              break;
            case 'COMPONENT_EDIT_REQUESTED':
              // Handle component edit request
              console.log('Component edit requested:', event.data.instanceId);
              break;
            case 'COMPONENT_DUPLICATE_REQUESTED':
              // Handle component duplicate request
              console.log('Component duplicate requested:', event.data.instanceId);
              break;
            case 'COMPONENT_DELETE_REQUESTED':
              // Handle component delete request
              console.log('Component delete requested:', event.data.instanceId);
              break;
            case 'COMPONENT_MOVE_LAYER_REQUESTED':
              // Handle component layer movement
              console.log('Component layer move requested:', event.data);
              break;
            case 'CONTENT_RESIZED':
              // Handle content resize
              console.log('Content resized:', event.data.dimensions);
              break;
          }
        }
      };

      window.addEventListener('message', handleMessage);

      return () => {
        window.removeEventListener('message', handleMessage);
      };
    }, [ref, onElementSelect, onComponentSelect, onComponentMove]);

    // Update iframe content when any prop changes
    useEffect(() => {
      const updateIframe = () => {
        if ((ref as any)?.current) {
          const iframe = (ref as any).current;
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

          if (iframeDoc) {
            iframeDoc.open();
            iframeDoc.write(generateDocumentContent());
            iframeDoc.close();
          }
        }
      };

      // Debounce updates to avoid excessive iframe reloading
      const timeoutId = setTimeout(updateIframe, 300);

      return () => clearTimeout(timeoutId);
    }, [generateDocumentContent, ref]);

    // Update component context in iframe
    useEffect(() => {
      if ((ref as any)?.current && (ref as any).current.contentWindow) {
        (ref as any).current.contentWindow.postMessage({
          type: 'UPDATE_COMPONENT_CONTEXT',
          context: {
            insertionMode: insertionContext?.insertionMode || 'click-insert',
            snapToGrid: insertionContext?.snapToGrid || false,
            snapToElements: insertionContext?.snapToElements || false,
            showGuides: insertionContext?.showGuides || false
          }
        }, '*');
      }
    }, [insertionContext, ref]);

    // Update live components in iframe
    useEffect(() => {
      if ((ref as any)?.current && (ref as any).current.contentWindow) {
        (ref as any).current.contentWindow.postMessage({
          type: 'REFRESH_COMPONENTS',
          components: Array.from(liveComponents.entries())
        }, '*');
      }
    }, [liveComponents, ref]);

    return (
      <div className={cn("relative w-full h-full", className)}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading preview...</p>
            </div>
          </div>
        )}

        <iframe
          ref={ref}
          className={cn(
            "w-full h-full border-0 bg-background",
            className
          )}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
          onLoad={handleIframeLoad}
          title="Live Preview"
        />
      </div>
    );
  }
);

LivePreviewIframe.displayName = 'LivePreviewIframe';