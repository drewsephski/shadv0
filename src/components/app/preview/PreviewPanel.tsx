"use client";

import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import {
  WebPreview,
  WebPreviewNavigation,
  WebPreviewBody,
  WebPreviewActions,
  WebPreviewNavigationButton,
} from '@/components/ai-elements/web-preview';
import RefreshIcon from '@/components/ui/refresh-icon';
import CodeIcon from '@/components/ui/code-icon';
import ExternalLinkIcon from '@/components/ui/external-link-icon';
import { CopyIcon, Download, Smartphone, Monitor, Tablet, Loader, Sparkles, Code } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RefinementControls } from './RefinementControls';
import { useRefinement } from '@/hooks/use-refinement';
import { RefinementType } from '@/types/refinement';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import JSZip from 'jszip';

type PreviewPanelProps = {
  dataUrl: string;
  htmlContent: string;
  onRefineCode: (code: string) => void;
  onRefinementRequest?: (type: RefinementType, prompt?: string, originalHtml?: string) => Promise<void>;
  onElementSelect?: (outerHtml: string) => void; // New prop for element selection
  selectedModel?: string;
};

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

export function PreviewPanel({
  dataUrl,
  htmlContent,
  onRefineCode,
  onRefinementRequest,
  onElementSelect, // Destructure new prop
  selectedModel
}: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [viewport, setViewport] = useState<ViewportSize>('desktop');

  const {
    refinementHistory,
    isRefining,
    currentRefinement,
    addRefinementRequest,
    updateRefinementStatus,
    revertRefinement,
    clearHistory,
    getRefinedHtml,
    createRefinementRequest,
  } = useRefinement();

  // Get the current HTML content (either original or refined)
  const currentHtmlContent = useMemo(() =>
    getRefinedHtml(htmlContent),
    [htmlContent, getRefinedHtml]
  );

  // Update the dataUrl when HTML content changes
  const currentDataUrl = useMemo(() =>
    'data:text/html;charset=utf-8,' + encodeURIComponent(currentHtmlContent),
    [currentHtmlContent]
  );

  const handleRefine = () => {
    onRefineCode(currentHtmlContent);
  };

  const handleRefinementRequest = async (type: RefinementType, prompt?: string) => {
    if (!onRefinementRequest) return;

    const refinementRequest = createRefinementRequest(
      type,
      prompt || `Quick ${type} refinement`,
      currentHtmlContent,
      selectedModel
    );

    addRefinementRequest(refinementRequest);

    try {
      await onRefinementRequest(type, prompt, currentHtmlContent);

      // The refinement request was successful
      updateRefinementStatus(
        refinementRequest.id,
        'completed',
        currentHtmlContent // This would be the refined content
      );
    } catch (error) {
      updateRefinementStatus(
        refinementRequest.id,
        'failed',
        undefined,
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  };

  const handleRevertRefinement = (refinementId: string) => {
    revertRefinement(refinementId);
    // Refresh the iframe to show the reverted content
    if (iframeRef.current) {
      iframeRef.current.src = currentDataUrl;
    }
  };

  const handleClearHistory = () => {
    clearHistory();
    // Refresh the iframe to show the original content
    if (iframeRef.current) {
      iframeRef.current.src = dataUrl;
    }
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = dataUrl;
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleViewSource = () => {
    const sourceWindow = window.open('about:blank', '_blank');
    if (sourceWindow) {
      sourceWindow.document.write(
        `<html><head><title>Source Code</title><style>
          body { font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; margin: 20px; background: #1e1e1e; color: #d4d4d4; }
          pre { white-space: pre-wrap; word-wrap: break-word; }
        </style></head><body><pre>` +
          htmlContent.replace(/[&<>]/g, (c) => 
            ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] || c)
          ) +
          '</pre></body></html>'
      );
      sourceWindow.document.close();
    }
  };

  const handleOpenInNewTab = () => {
    const newWindow = window.open('about:blank', '_blank');
    if (newWindow) {
      newWindow.document.write(currentHtmlContent); // Use currentHtmlContent
      newWindow.document.close();
    }
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadHtml = () => {
    downloadFile(currentHtmlContent, 'generated-app.html', 'text/html');
  };

  const handleDownloadZip = async () => {
    const zip = new JSZip();
    zip.file('index.html', currentHtmlContent);

    // Basic extraction of CSS and JS from HTML (can be improved)
    const cssMatch = currentHtmlContent.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    if (cssMatch && cssMatch[1]) {
      zip.file('style.css', cssMatch[1]);
    }
    const jsMatch = currentHtmlContent.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
    if (jsMatch && jsMatch[1]) {
      zip.file('script.js', jsMatch[1]);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    downloadFile(content, 'generated-app.zip', 'application/zip');
  };

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

  const [isLoading, setIsLoading] = useState(true);

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
    // Inject script for element selection
    if (iframeRef.current && onElementSelect) {
      const iframeWindow = iframeRef.current.contentWindow;
      if (iframeWindow) {
        const script = `
          document.body.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            e.stopPropagation();
            const target = e.target;
            if (target && target.outerHTML) {
              window.parent.postMessage({ type: 'ELEMENT_SELECTED', outerHTML: target.outerHTML }, '*');
            }
          });
        `;
        const scriptElement = iframeWindow.document.createElement('script');
        scriptElement.innerHTML = script;
        iframeWindow.document.body.appendChild(scriptElement);
      }
    }
  }, [onElementSelect]);

  // Listen for messages from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Ensure the message is from our iframe and has the correct type
      if (event.source === iframeRef.current?.contentWindow && event.data && event.data.type === 'ELEMENT_SELECTED') {
        if (onElementSelect) {
          onElementSelect(event.data.outerHTML);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onElementSelect]);

  return (
    <div className="h-full w-full bg-background flex flex-col">
      <WebPreview className="flex-1 flex flex-col">
        <WebPreviewNavigation className="border-b bg-muted/30 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-background rounded-md p-1">
              {(['desktop', 'tablet', 'mobile'] as ViewportSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => setViewport(size)}
                  className={cn(
                    "p-1.5 rounded-sm transition-colors",
                    viewport === size
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent text-muted-foreground"
                  )}
                  title={`${size} view`}
                >
                  {getViewportIcon(size)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm font-medium text-muted-foreground">Preview</p>
          </div>

          <WebPreviewActions>
            <WebPreviewNavigationButton onClick={handleRefresh} tooltip="Refresh">
              <RefreshIcon className="size-4" />
            </WebPreviewNavigationButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <WebPreviewNavigationButton tooltip="Export Code">
                  <Code className="size-4" />
                </WebPreviewNavigationButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem onClick={() => handleCopy(currentHtmlContent)}>
                  <CopyIcon className="mr-2 size-4" />
                  <span>Copy HTML</span>
                </DropdownMenuItem>
                {/* Assuming CSS and JS can be extracted or are available separately */}
                {/* For now, just copy HTML as a placeholder for CSS/JS */}
                <DropdownMenuItem onClick={() => handleCopy(currentHtmlContent)}>
                  <CopyIcon className="mr-2 size-4" />
                  <span>Copy CSS (placeholder)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCopy(currentHtmlContent)}>
                  <CopyIcon className="mr-2 size-4" />
                  <span>Copy JS (placeholder)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadHtml}>
                  <Download className="mr-2 size-4" />
                  <span>Download as HTML</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadZip}>
                  <Download className="mr-2 size-4" />
                  <span>Download as .zip</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <WebPreviewNavigationButton onClick={handleViewSource} tooltip="View Source">
              <CodeIcon className="size-4" />
            </WebPreviewNavigationButton>
            <WebPreviewNavigationButton onClick={handleOpenInNewTab} tooltip="Open in New Tab">
              <ExternalLinkIcon className="size-4" />
            </WebPreviewNavigationButton>
            <WebPreviewNavigationButton onClick={handleRefine} tooltip="Refine Code">
              <Sparkles className="size-4" />
            </WebPreviewNavigationButton>
          </WebPreviewActions>
        </WebPreviewNavigation>

        <div className="flex-1 flex flex-col min-h-0 bg-muted/10 p-4">
          <div className={cn("relative flex-1 flex flex-col transition-all duration-300 overflow-hidden", getViewportStyles())}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
                <Loader className="size-8 animate-spin" />
              </div>
            )}
            <WebPreviewBody
              ref={iframeRef}
              src={currentDataUrl}
              onLoad={handleIframeLoad}
              className="w-full h-full rounded-lg shadow-lg border bg-background"
              style={{ minHeight: 0 }} // Ensure iframe can shrink below content size
            />
          </div>
        </div>
      </WebPreview>

      {/* Refinement Controls */}
      <RefinementControls
        onRefinementRequest={handleRefinementRequest}
        isLoading={isRefining}
        disabled={isLoading}
        refinementHistory={refinementHistory}
        onRevertRefinement={handleRevertRefinement}
        onClearHistory={handleClearHistory}
        className="border-t bg-muted/30 p-4"
      />
    </div>
  );
}
