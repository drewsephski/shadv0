'use client';

import { Message as MessageComponent } from "@/components/ai-elements/message";
import { MODELS } from "@/constants/models";
import { formatModelName } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Copy, ThumbsUp, ThumbsDown, RotateCcw, Check, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocalStorage } from 'usehooks-ts';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';

type MessageFeedback = {
  messageId: string;
  isLiked: boolean | null;
  isCopied: boolean;
};

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
  const [isLiked, setIsLiked] = useState<boolean | null>(null);
  const [feedbackData, setFeedbackData] = useLocalStorage<MessageFeedback[]>('message-feedback', []);
  
  // Generate a stable ID for the message
  const messageId = message.content.substring(0, 32) + (message.timestamp?.getTime() || '');
  
  // Load saved feedback for this message
  useEffect(() => {
    const savedFeedback = feedbackData.find(fb => fb.messageId === messageId);
    if (savedFeedback) {
      setCopied(savedFeedback.isCopied);
      setIsLiked(savedFeedback.isLiked);
    }
  }, [messageId, feedbackData]);

  const updateFeedback = (updates: Partial<MessageFeedback>) => {
    setFeedbackData(prev => {
      const existing = prev.find(fb => fb.messageId === messageId);
      if (existing) {
        return prev.map(fb => 
          fb.messageId === messageId ? { ...fb, ...updates } : fb
        );
      }
      return [...prev, { messageId, isLiked: null, isCopied: false, ...updates }];
    });
  };

  // Format model name for display
  const formatModelDisplayName = (modelId?: string) => {
    if (!modelId) return '';
    const modelInfo = MODELS[modelId.replace('z-ai/', '')];
    return modelInfo ? modelInfo.name : formatModelName(modelId);
  };

  // Enhanced streaming effect with word-by-word rendering
  useEffect(() => {
    if (!message.isStreaming || !message.content) {
      setDisplayedContent(message.content || '');
      return;
    }

    const content = message.content;
    const words = content.split(/(\s+)/);
    let currentWordIndex = 0;
    
    setDisplayedContent('');
    
    const typeWriter = () => {
      if (currentWordIndex < words.length) {
        setDisplayedContent(prev => prev + words[currentWordIndex]);
        currentWordIndex++;
        const delay = Math.random() * 20 + 20; // Variable speed for natural feel
        setTimeout(typeWriter, delay);
      }
    };
    
    typeWriter();
    
    return () => {
      // Cleanup function
    };
  }, [message.content, message.isStreaming]);

  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    updateFeedback({ isCopied: true });
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle feedback
  const handleFeedback = (isPositive: boolean) => {
    setIsLiked(isPositive);
    updateFeedback({ isLiked: isPositive });
    onFeedback?.(isPositive);
  };

  // Create ripple effect for buttons
  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  // Render message content with markdown support
  const renderContent = () => {
    if (!displayedContent && !message.content) return null;
    
    return (
      <MarkdownRenderer 
        content={displayedContent || message.content}
        className="prose-p:leading-relaxed prose-p:my-3 prose-ul:my-2 prose-li:my-1"
      />
    );
  };

  return (
    <MessageComponent
      from={message.type}
      model={message.type === 'assistant' ? formatModelDisplayName(message.model) : undefined}
      timestamp={message.timestamp}
      className="group/message"
    >
      {/* Streaming indicator for assistant messages */}
      {message.type === 'assistant' && message.isStreaming && !message.content && (
        <div className="flex items-center gap-2 mb-3">
          <Loader className="size-4 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Thinking...</p>
        </div>
      )}
      
      {/* Message content with markdown support */}
      {message.content && (
        <div className="prose dark:prose-invert max-w-none prose-sm">
          {renderContent()}
        </div>
      )}
      
      {/* Action buttons for assistant messages */}
      {message.type === 'assistant' && message.content && (
        <div className="mt-4 flex flex-wrap gap-2 justify-end">
          <div className="relative overflow-hidden">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 h-8 text-xs"
              onClick={(e) => {
                createRipple(e);
                handleCopy();
              }}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </Button>
          </div>
          
          {onFeedback && (
            <>
              <div className="relative overflow-hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-1.5 h-8 text-xs ${isLiked === true ? 'text-green-500' : ''}`}
                  onClick={(e) => {
                    createRipple(e);
                    handleFeedback(true);
                  }}
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  Helpful
                </Button>
              </div>
              
              <div className="relative overflow-hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-1.5 h-8 text-xs ${isLiked === false ? 'text-red-500' : ''}`}
                  onClick={(e) => {
                    createRipple(e);
                    handleFeedback(false);
                  }}
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                  Not helpful
                </Button>
              </div>
            </>
          )}
          
          {onRegenerate && (
            <div className="relative overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 h-8 text-xs"
                onClick={(e) => {
                  createRipple(e);
                  onRegenerate();
                }}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Regenerate
              </Button>
            </div>
          )}
        </div>
      )}
    </MessageComponent>
  );
}