"use client";

import { useRef, useState } from 'react';
import {
  WebPreview,
  WebPreviewNavigation,
  WebPreviewUrl,
  WebPreviewBody,
  WebPreviewActions,
  WebPreviewNavigationButton,
} from '@/components/ai-elements/web-preview';
import RefreshIcon from '@/components/ui/refresh-icon';
import CodeIcon from '@/components/ui/code-icon';
import ExternalLinkIcon from '@/components/ui/external-link-icon';
import { CopyIcon } from 'lucide-react';

type PreviewPanelProps = {
  dataUrl: string;
  htmlContent: string;
};

export function PreviewPanel({ dataUrl, htmlContent }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isCopied, setIsCopied] = useState(false);

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
        '<pre>' +
          htmlContent.replace(/[&<>]/g, (c) => 
            ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] || c)
          ) +
          '</pre>'
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

  return (
    <WebPreview defaultUrl={dataUrl} onRefresh={handleRefresh}>
      <WebPreviewNavigation>
        <WebPreviewActions>
          <WebPreviewNavigationButton onClick={handleRefresh} tooltip="Refresh">
            <RefreshIcon className="size-4" />
          </WebPreviewNavigationButton>
        </WebPreviewActions>
        <WebPreviewUrl />
        <WebPreviewActions>
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
      <WebPreviewBody ref={iframeRef} />
    </WebPreview>
  );
}
