import { Message as MessageComponent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import { Actions } from "@/components/ai-elements/actions";
import { CodeBlock } from "@/components/ai-elements/code-block";
import { MODELS } from "@/constants/models";
import { formatModelName } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Copy, ThumbsUp, ThumbsDown, RotateCcw, ExternalLink } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type MessageType = {
  type: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  model?: string;
  isStreaming?: boolean;
  tools?: Array<{
    name: string;
    input: Record<string, unknown>;
    output: string;
    status: 'pending' | 'completed' | 'error';
  }>;
};

type ChatMessageProps = {
  message: MessageType;
  onRegenerate?: () => void;
  onFeedback?: (isPositive: boolean) => void;
};

export function ChatMessage({ message, onRegenerate, onFeedback }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [displayedContent, setDisplayedContent] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  // Format model name for display
  const formatModelDisplayName = (modelId?: string) => {
    if (!modelId) return '';
    const modelInfo = MODELS[modelId.replace('z-ai/', '')];
    return modelInfo ? modelInfo.name : formatModelName(modelId);
  };

  // Handle streaming text effect
  useEffect(() => {
    if (!message.isStreaming || !message.content) {
      setDisplayedContent(message.content);
      return;
    }

    let currentIndex = 0;
    const content = message.content;
    setDisplayedContent('');

    const interval = setInterval(() => {
      if (currentIndex < content.length) {
        setDisplayedContent(prev => prev + content[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [message.content, message.isStreaming]);

  // Auto-scroll to bottom when content updates
  useEffect(() => {
    if (contentRef.current && message.isStreaming) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [displayedContent, message.isStreaming]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleFeedback = (isPositive: boolean) => {
    onFeedback?.(isPositive);
  };

  // Parse message content for special components
  const renderContent = () => {
    if (message.type === 'user') {
      return (
        <div className="whitespace-pre-wrap">
          {message.content}
        </div>
      );
    }

    // For assistant messages, parse and render special components
    try {
      // Check for code blocks
      if (message.content.includes('```')) {
        const parts = message.content.split(/(```[\s\S]*?```)/g);
        return (
          <div className="space-y-4">
            {parts.map((part, index) => {
              if (part.startsWith('```') && part.endsWith('```')) {
                const codeContent = part.slice(3, -3).trim();
                const languageMatch = codeContent.match(/^(\w+)\n/);
                const language = languageMatch ? languageMatch[1] : 'plaintext';
                const code = languageMatch ? codeContent.replace(/^\w+\n/, '') : codeContent;
                
                return (
                  <CodeBlock 
                    key={index} 
                    code={code} 
                    language={language}
                    className="my-4"
                  />
                );
              }
              return (
                <Response 
                  key={index} 
                  className="prose dark:prose-invert max-w-none prose-sm"
                  parseIncompleteMarkdown={true}
                >
                  {part}
                </Response>
              );
            })}
          </div>
        );
      }

      // Check for tool calls
      if (message.tools?.length) {
        return (
          <div className="space-y-4">
            {message.tools.map((tool, index) => (
              <div key={index} className="border rounded-lg p-4 my-2 bg-muted/20">
                <div className="font-mono text-sm mb-2">
                  <span className="font-semibold">Tool:</span> {tool.name}
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  <span className="font-medium">Status:</span> {tool.status}
                </div>
                {tool.input && (
                  <div className="mb-2">
                    <div className="text-xs font-medium text-muted-foreground mb-1">Input:</div>
                    <pre className="text-xs bg-muted/50 p-2 rounded overflow-auto">
                      {JSON.stringify(tool.input, null, 2)}
                    </pre>
                  </div>
                )}
                {tool.output && (
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-1">Output:</div>
                    <pre className="text-xs bg-muted/50 p-2 rounded overflow-auto">
                      {typeof tool.output === 'string' ? tool.output : JSON.stringify(tool.output, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
            <Response className="prose dark:prose-invert max-w-none prose-sm">
              {message.content}
            </Response>
          </div>
        );
      }

      // Default response rendering
      return (
        <Response 
          className="prose dark:prose-invert max-w-none prose-sm"
          parseIncompleteMarkdown={true}
        >
          {displayedContent}
        </Response>
      );
    } catch (error) {
      console.error('Error rendering message content:', error);
      return (
        <Response className="prose dark:prose-invert max-w-none prose-sm">
          {message.content}
        </Response>
      );
    }
  };

  return (
    <div className="group w-full" ref={contentRef}>
      <MessageComponent 
        from={message.type}
        model={message.type === 'assistant' ? formatModelDisplayName(message.model) : undefined}
        timestamp={message.timestamp}
        className="transition-all duration-200 hover:scale-[1.01]"
      >
        <div className="space-y-2">
          {renderContent()}
          
          {message.type === 'assistant' && message.content && (
            <Actions className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 px-2 text-xs"
                title="Copy to clipboard"
              >
                <Copy className="size-3 mr-1" />
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => handleFeedback(true)}
                title="Good response"
              >
                <ThumbsUp className="size-3 mr-1" />
                Good
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => handleFeedback(false)}
                title="Needs improvement"
              >
                <ThumbsDown className="size-3 mr-1" />
                Bad
              </Button>
              
              {onRegenerate && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={onRegenerate}
                  title="Regenerate response"
                >
                  <RotateCcw className="size-3 mr-1" />
                  Regenerate
                </Button>
              )}
              
              {message.content.includes('```html') && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-8 px-2 text-xs"
                >
                  <a 
                    href={`data:text/html;charset=utf-8,${encodeURIComponent(
                      message.content.match(/```html\n([\s\S]*?)\n```/)?.[1] || ''
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open in new tab"
                  >
                    <ExternalLink className="size-3 mr-1" />
                    Open
                  </a>
                </Button>
              )}
            </Actions>
          )}
        </div>
      </MessageComponent>
    </div>
  );
}
