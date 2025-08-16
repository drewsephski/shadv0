"use client";

import { useRef, useState } from 'react';
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
import { CopyIcon, Download, Smartphone, Monitor, Tablet } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type PreviewPanelProps = {
  dataUrl: string;
  htmlContent: string;
};

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

export function PreviewPanel({ dataUrl, htmlContent }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [viewport, setViewport] = useState<ViewportSize>('desktop');

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = dataUrl;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlContent).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    });
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
      newWindow.document.write(htmlContent);
      newWindow.document.close();
    }
  };

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-app.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

  return (
    <Card className="h-full flex flex-col">
      <WebPreview className="flex-1 flex flex-col">
        <WebPreviewNavigation className="border-b bg-muted/30">
          <WebPreviewActions>
            <WebPreviewNavigationButton onClick={handleRefresh} tooltip="Refresh">
              <RefreshIcon className="size-4" />
            </WebPreviewNavigationButton>
          </WebPreviewActions>
          
          <div className="flex-1 flex items-center justify-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Live Preview
            </Badge>
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

          <WebPreviewActions>
            <WebPreviewNavigationButton onClick={handleDownload} tooltip="Download HTML">
              <Download className="size-4" />
            </WebPreviewNavigationButton>
            <WebPreviewNavigationButton onClick={handleCopy} tooltip={isCopied ? 'Copied!' : 'Copy Code'}>
              <CopyIcon className="size-4" />
            </WebPreviewNavigationButton>
            <WebPreviewNavigationButton onClick={handleViewSource} tooltip="View Source">
              <CodeIcon className="size-4" />
            </WebPreviewNavigationButton>
            <WebPreviewNavigationButton onClick={handleOpenInNewTab} tooltip="Open in New Tab">
              <ExternalLinkIcon className="size-4" />
            </WebPreviewNavigationButton>
          </WebPreviewActions>
        </WebPreviewNavigation>
        
        <div className="flex-1 p-4 bg-muted/10">
          <div className={cn("h-full transition-all duration-300", getViewportStyles())}>
            <WebPreviewBody 
              ref={iframeRef} 
              src={dataUrl} 
              className="w-full h-full rounded-lg shadow-lg border bg-background"
            />
          </div>
        </div>
      </WebPreview>
    </Card>
  );
}
