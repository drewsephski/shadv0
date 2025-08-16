import { Message as MessageComponent } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import { Actions } from "@/components/ai-elements/actions";
import { MODELS } from "@/constants/models";
import { formatModelName } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Copy, ThumbsUp, ThumbsDown, RotateCcw } from "lucide-react";
import { useState } from "react";

type MessageType = {
  type: 'user' | 'assistant';
  content: string;
  model?: string;
  timestamp?: Date;
};

type ChatMessageProps = {
  message: MessageType;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);

  // Format model name for display (remove the 'z-ai/' prefix if present)
  const formatModelDisplayName = (modelId?: string) => {
    if (!modelId) return '';
    const modelInfo = MODELS[modelId];
    return modelInfo ? modelInfo.name : formatModelName(modelId);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  return (
    <div className="group w-full">
      <MessageComponent
        from={message.type}
        model={message.type === 'assistant' ? formatModelDisplayName(message.model) : undefined}
        timestamp={message.timestamp}
        className="transition-all duration-200 hover:scale-[1.01]"
      >
        <Response
          className="prose dark:prose-invert max-w-none prose-sm"
          parseIncompleteMarkdown={true}
        >
          {message.content}
        </Response>

        {message.type === 'assistant' && (
          <Actions className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 px-2 text-xs"
            >
              <Copy className="size-3 mr-1" />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
            >
              <ThumbsUp className="size-3 mr-1" />
              Good
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
            >
              <ThumbsDown className="size-3 mr-1" />
              Bad
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
            >
              <RotateCcw className="size-3 mr-1" />
              Retry
            </Button>
          </Actions>
        )}
      </MessageComponent>
    </div>
  );
}
