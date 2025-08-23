"use client";

import { useState, useCallback, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Code,
  Eye,
  Split,
  Palette,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  Copy,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLivePreview, LivePreviewState } from '@/hooks/use-live-preview';
import { LivePreviewIframe } from './LivePreviewIframe';
import { DesignSystemConfig } from '@/app/types';

interface LivePreviewEditorProps {
  initialHTML?: string;
  initialDesignConfig?: DesignSystemConfig;
  onHTMLChange?: (html: string) => void;
  onDesignChange?: (config: DesignSystemConfig) => void;
  className?: string;
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

export function LivePreviewEditor({
  initialHTML = '',
  initialDesignConfig,
  onHTMLChange,
  onDesignChange,
  className
}: LivePreviewEditorProps) {
  const { state, actions, iframeRef } = useLivePreview(initialHTML, initialDesignConfig);
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync changes with parent
  useEffect(() => {
    if (onHTMLChange) {
      onHTMLChange(state.htmlContent);
    }
  }, [state.htmlContent, onHTMLChange]);

  useEffect(() => {
    if (onDesignChange) {
      onDesignChange(state.designConfig);
    }
  }, [state.designConfig, onDesignChange]);

  const handleCodeChange = useCallback((value: string) => {
    actions.updateHTML(value);
  }, [actions]);

  const handleCSSChange = useCallback((value: string) => {
    actions.updateCSS(value);
  }, [actions]);

  const handleJSChange = useCallback((value: string) => {
    actions.updateJS(value);
  }, [actions]);

  const handleCopyCode = useCallback(async () => {
    const fullCode = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${actions.injectCSSVariables()}${state.cssContent}</style>
</head>
<body>
    ${state.htmlContent}
    <script>${state.jsContent}</script>
</body>
</html>`.trim();

    try {
      await navigator.clipboard.writeText(fullCode);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  }, [state, actions]);

  const handleDownloadCode = useCallback(() => {
    const fullCode = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${actions.injectCSSVariables()}${state.cssContent}</style>
</head>
<body>
    ${state.htmlContent}
    <script>${state.jsContent}</script>
</body>
</html>`.trim();

    const blob = new Blob([fullCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'live-preview.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [state, actions]);

  const getViewportStyles = () => {
    switch (viewport) {
      case 'mobile':
        return 'max-w-[375px] mx-auto';
      case 'tablet':
        return 'max-w-[768px] mx-auto';
      default:
        return 'w-full';
    }
  };

  const getViewportIcon = (size: ViewportSize) => {
    switch (size) {
      case 'mobile':
        return <Smartphone className="size-4" />;
      case 'tablet':
        return <Tablet className="size-4" />;
      default:
        return <Monitor className="size-4" />;
    }
  };

  return (
    <div className={cn(
      "h-full w-full bg-background flex flex-col",
      isFullscreen && "fixed inset-0 z-50 bg-background",
      className
    )}>
      {/* Header Controls */}
      <div className="border-b bg-muted/30 p-3 flex-shrink-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex items-center bg-background rounded-md p-1">
              {[
                { key: 'code', icon: Code, label: 'Code' },
                { key: 'split', icon: Split, label: 'Split' },
                { key: 'preview', icon: Eye, label: 'Preview' }
              ].map(({ key, icon: Icon, label }) => (
                <Button
                  key={key}
                  variant={state.activeView === key ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => actions.setActiveView(key as LivePreviewState['activeView'])}
                  className="px-2"
                >
                  <Icon className="size-4" />
                  <span className="ml-1 hidden sm:inline">{label}</span>
                </Button>
              ))}
            </div>

            {/* Viewport Toggle */}
            {state.activeView !== 'code' && (
              <>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center bg-background rounded-md p-1">
                  {(['desktop', 'tablet', 'mobile'] as ViewportSize[]).map((size) => (
                    <Button
                      key={size}
                      variant={viewport === size ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewport(size)}
                      title={`${size} view`}
                    >
                      {getViewportIcon(size)}
                    </Button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Design Controls Toggle */}
            <Button
              variant={showControls ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowControls(!showControls)}
            >
              <Palette className="size-4" />
              <span className="ml-1 hidden sm:inline">Design</span>
            </Button>

            {/* Actions */}
            <Button variant="outline" size="sm" onClick={actions.reset}>
              <RefreshCw className="size-4" />
            </Button>

            <Button variant="outline" size="sm" onClick={handleCopyCode}>
              <Copy className="size-4" />
            </Button>

            <Button variant="outline" size="sm" onClick={handleDownloadCode}>
              <Download className="size-4" />
            </Button>

            {/* Fullscreen Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </Button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>
            {state.isDirty && '● Unsaved changes'}
            {state.selectedElement && ` | Selected: ${state.selectedElement}`}
          </span>
          <span>
            {state.activeView === 'split' ? 'Split View' :
             state.activeView === 'code' ? 'Code View' : 'Preview View'}
            {viewport !== 'desktop' && ` | ${viewport} viewport`}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex min-h-0">
        {/* Design Controls Panel */}
        {showControls && (
          <div className="w-80 border-r bg-muted/10 flex-shrink-0">
            <DesignControlsPanel
              designConfig={state.designConfig}
              onDesignChange={actions.updateDesignConfig}
              onPropertyChange={actions.applyDesignChange}
            />
          </div>
        )}

        {/* Editor/Preview Area */}
        <div className="flex-1 flex">
          {/* Code Editor */}
          {(state.activeView === 'code' || state.activeView === 'split') && (
            <div className={cn(
              "flex flex-col",
              state.activeView === 'split' ? 'w-1/2 border-r' : 'w-full'
            )}>
              <Tabs defaultValue="html" className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-3 mx-3 mt-2">
                  <TabsTrigger value="html">HTML</TabsTrigger>
                  <TabsTrigger value="css">CSS</TabsTrigger>
                  <TabsTrigger value="js">JavaScript</TabsTrigger>
                </TabsList>
                <TabsContent value="html" className="flex-1 m-3 mt-2">
                  <Textarea
                    value={state.htmlContent}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    placeholder="Enter your HTML code here..."
                    className="h-full font-mono text-sm resize-none"
                  />
                </TabsContent>
                <TabsContent value="css" className="flex-1 m-3 mt-2">
                  <Textarea
                    value={state.cssContent}
                    onChange={(e) => handleCSSChange(e.target.value)}
                    placeholder="Enter your CSS code here..."
                    className="h-full font-mono text-sm resize-none"
                  />
                </TabsContent>
                <TabsContent value="js" className="flex-1 m-3 mt-2">
                  <Textarea
                    value={state.jsContent}
                    onChange={(e) => handleJSChange(e.target.value)}
                    placeholder="Enter your JavaScript code here..."
                    className="h-full font-mono text-sm resize-none"
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Preview Panel */}
          {(state.activeView === 'preview' || state.activeView === 'split') && (
            <div className={cn(
              "flex flex-col",
              state.activeView === 'split' ? 'w-1/2' : 'w-full'
            )}>
              <div className="flex-1 p-3">
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Eye className="size-4" />
                      Live Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 h-full">
                    <div className={cn(
                      "relative h-full flex flex-col transition-all duration-300 overflow-hidden",
                      getViewportStyles()
                    )}>
                      <LivePreviewIframe
                        ref={iframeRef}
                        htmlContent={state.htmlContent}
                        cssContent={state.cssContent}
                        jsContent={state.jsContent}
                        designConfig={state.designConfig}
                        onElementSelect={actions.setSelectedElement}
                        className="w-full h-full rounded-lg shadow-lg border bg-background"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}