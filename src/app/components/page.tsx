// Component Builder Page
// Dedicated page for component insertion and manipulation

"use client";

import { useState } from 'react';
import { ComponentInsertionWrapper, componentInsertionPresets, useComponentInsertion } from '@/components/app/preview/ComponentInsertionWrapper';
import { useLivePreview } from '@/hooks/use-live-preview';
import { useDesignConfig } from '@/hooks/use-design-config';
import { useComponentLibrary } from '@/hooks/use-component-library';
import { ComponentBuilderBrowser } from '@/components/app/components/ComponentBuilderBrowser';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Palette,
  Code,
  Eye,
  Undo,
  Redo,
  Copy,
  Trash2,
  Move,
  Settings,
  Zap,
  Layers,
  Grid3X3,
  MousePointer,
  RotateCcw
} from 'lucide-react';

export default function ComponentBuilderPage() {
  const { config: designConfig } = useDesignConfig();
  const { state: livePreviewState, actions: livePreviewActions } = useLivePreview();
  const componentInsertion = useComponentInsertion(componentInsertionPresets.full);
  const componentLibrary = useComponentLibrary();

  const [activeTab, setActiveTab] = useState('canvas');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [insertionMode, setInsertionMode] = useState<'click' | 'drag'>('click');

  // Handle component selection from library
  const handleComponentSelect = (componentId: string) => {
    setSelectedComponent(componentId);
  };

  // Handle component insertion
  const handleInsertComponent = async () => {
    if (!selectedComponent) return;

    try {
      const instanceId = await livePreviewActions.insertComponent({
        componentId: selectedComponent,
        position: 'append',
        props: {}
      });

      console.log('Component inserted:', instanceId);
    } catch (error) {
      console.error('Failed to insert component:', error);
    }
  };

  // Handle component actions
  const handleUndo = async () => {
    await livePreviewActions.undoComponentAction();
  };

  const handleRedo = async () => {
    await livePreviewActions.redoComponentAction();
  };

  const handleClearCanvas = () => {
    // Reset the live preview
    livePreviewActions.reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                <h1 className="text-lg font-semibold">Component Builder</h1>
              </div>
              <Badge variant="secondary" className="text-xs">
                {livePreviewState.liveComponents.size} components
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <TooltipProvider>
                <div className="flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleUndo}
                        disabled={livePreviewState.historyIndex < 0}
                      >
                        <Undo className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Undo</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRedo}
                        disabled={livePreviewState.historyIndex >= livePreviewState.insertionHistory.length - 1}
                      >
                        <Redo className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Redo</TooltipContent>
                  </Tooltip>

                  <Separator orientation="vertical" className="h-6" />

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearCanvas}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Clear Canvas</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="canvas" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Canvas
            </TabsTrigger>
            <TabsTrigger value="components" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Components
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="canvas" className="mt-6">
            <div className="grid grid-cols-4 gap-6 h-[600px]">
              {/* Component Library Sidebar */}
              <div className="col-span-1">
                <ComponentBuilderBrowser
                  onComponentSelect={handleComponentSelect}
                  onComponentInsert={async (componentId) => {
                    try {
                      const instanceId = await livePreviewActions.insertComponent({
                        componentId,
                        position: 'append',
                        props: {}
                      });
                      console.log('Component inserted:', instanceId);
                    } catch (error) {
                      console.error('Failed to insert component:', error);
                    }
                  }}
                  selectedComponentId={selectedComponent || undefined}
                />
              </div>

              {/* Live Preview Canvas */}
              <div className="col-span-3">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Live Preview Canvas
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {insertionMode === 'click' ? 'Click to Insert' : 'Drag to Insert'}
                        </Badge>
                        <Badge variant="secondary">
                          {livePreviewState.liveComponents.size} components
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-card border rounded-lg overflow-hidden">
                      <ComponentInsertionWrapper
                        htmlContent={livePreviewState.htmlContent}
                        cssContent={livePreviewState.cssContent}
                        jsContent={livePreviewState.jsContent}
                        designConfig={designConfig}
                        componentInsertionConfig={componentInsertion.config}
                        onComponentSelect={(instanceId) => {
                          console.log('Component selected:', instanceId);
                        }}
                        onComponentMove={(instanceId, position) => {
                          livePreviewActions.moveComponent(instanceId, position);
                        }}
                        onComponentInsert={(position) => {
                          console.log('Insert at position:', position);
                        }}
                        className="w-full h-[500px]"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="components" className="mt-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Component Properties */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Component Properties
                  </CardTitle>
                  <CardDescription>
                    Configure selected component properties
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Position</label>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-muted-foreground">X</label>
                          <input
                            type="number"
                            className="w-full px-2 py-1 text-sm border rounded"
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Y</label>
                          <input
                            type="number"
                            className="w-full px-2 py-1 text-sm border rounded"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Size</label>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-muted-foreground">Width</label>
                          <input
                            type="number"
                            className="w-full px-2 py-1 text-sm border rounded"
                            placeholder="auto"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Height</label>
                          <input
                            type="number"
                            className="w-full px-2 py-1 text-sm border rounded"
                            placeholder="auto"
                          />
                        </div>
                      </div>
                    </div>

                    <Button className="w-full" size="sm">
                      Apply Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Component Tree */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Component Tree
                  </CardTitle>
                  <CardDescription>
                    View and manage component hierarchy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {livePreviewState.liveComponents && Array.from(livePreviewState.liveComponents.entries()).map(([instanceId, component]) => (
                        <div
                          key={instanceId}
                          className="flex items-center justify-between p-2 border rounded hover:bg-accent cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <span className="text-sm font-medium">{component.componentId}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="code" className="mt-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Generated HTML */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Generated HTML
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <pre className="text-xs bg-muted p-3 rounded border overflow-x-auto">
                      <code>{livePreviewState.htmlContent || '<div class="component-canvas">\n  <!-- Components will appear here -->\n</div>'}</code>
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Generated CSS */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Generated CSS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <pre className="text-xs bg-muted p-3 rounded border overflow-x-auto">
                      <code>{livePreviewState.cssContent || '/* Component styles will appear here */'}</code>
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}