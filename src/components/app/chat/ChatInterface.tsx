import { useState, useCallback, useEffect } from 'react';
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputModelSelect,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectValue
} from '@/components/ai-elements/prompt-input';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Loader } from '@/components/ai-elements/loader';
import { EmptyState } from './EmptyState';
import { ChatMessage } from './ChatMessage';
import { MODELS } from '@/constants/models';
import { Card } from '@/components/ui/card';
import { Code2, Cpu, MessageSquare, Lightbulb, Code, Palette, Zap } from 'lucide-react';
import { toast } from 'sonner';

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

type ChatInterfaceProps = {
  chatHistory: MessageType[];
  htmlContent?: string;
  isLoading: boolean;
  onSendMessage: (message: string, model: string) => void;
  currentResponse: string;
  selectedModel: string;
  onModelChange: (model: string) => void;
};

export function ChatInterface({
  chatHistory,
  isLoading,
  onSendMessage,
  currentResponse,
  selectedModel,
  onModelChange,
}: ChatInterfaceProps) {
  const [message, setMessage] = useState('');

  const promptSuggestions = [
    {
      icon: <Code2 className="size-4 mr-2" />,
      title: "Responsive navbar",
      description: "Build a modern navigation bar with Tailwind CSS",
      prompt: "Create a responsive navbar with Tailwind CSS that includes a logo, navigation links, and a mobile hamburger menu"
    },
    {
      icon: <Cpu className="size-4 mr-2" />,
      title: "AI chat interface",
      description: "Build a simple AI chat interface",
      prompt: "Create a clean, modern chat interface with message bubbles, input field, and send button using React and Tailwind"
    },
    {
      icon: <MessageSquare className="size-4 mr-2" />,
      title: "Feedback form",
      description: "Design a user feedback form",
      prompt: "Create a user feedback form with rating, text input, and submission button using React Hook Form and Tailwind CSS"
    },
    {
      icon: <Lightbulb className="size-4 mr-2" />,
      title: "Pricing section",
      description: "Generate a pricing section with toggle",
      prompt: "Design a pricing section with monthly/annual toggle, three pricing tiers, and call-to-action buttons using Tailwind CSS"
    },
    {
      icon: <Code className="size-4 mr-2" />,
      title: "Todo app",
      description: "Create a functional todo application",
      prompt: "Build a todo app with React that includes add, edit, delete, and mark as complete functionality with local storage persistence"
    },
    {
      icon: <Palette className="size-4 mr-2" />,
      title: "Landing page",
      description: "Design a beautiful landing page",
      prompt: "Create a modern landing page for a coffee shop with hero section, menu, testimonials, and contact information"
    },
    {
      icon: <Zap className="size-4 mr-2" />,
      title: "Admin dashboard",
      description: "Build a responsive admin dashboard",
      prompt: "Create a modern admin dashboard with sidebar navigation, charts, data tables, and dark mode toggle using React and Tailwind"
    },
    {
      icon: <Code2 className="size-4 mr-2" />,
      title: "E-commerce product card",
      description: "Design a product card component",
      prompt: "Create a responsive product card with image, title, price, rating, and add to cart button using Tailwind CSS"
    }
  ];

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    onSendMessage(message.trim(), selectedModel);
    setMessage('');
  }, [message, isLoading, onSendMessage, selectedModel]);

  const handleSuggestionClick = useCallback((prompt: string) => {
    setMessage(prompt);
  }, []);

  // Show build completion toast once when htmlContent is available
  useEffect(() => {
    const hasShownToast = sessionStorage.getItem('hasShownBuildComplete');
    if (!hasShownToast) {
      toast.success('Build completed!', {
        description: 'Your application has been successfully built and is ready to view.',
        duration: 5000,
      });
      sessionStorage.setItem('hasShownBuildComplete', 'true');
    }
  }, []);

  return (
    <Card className="flex flex-col h-full border-0 shadow-none bg-transparent">
      <div className="flex-1 flex flex-col min-h-0 relative">
        {chatHistory.length === 0 ? (
          <div className="absolute inset-0 flex items-end justify-center pb-2 overflow-auto">
            <div className="w-full max-w-4xl">
              <EmptyState onSuggestionClick={handleSuggestionClick} suggestions={promptSuggestions} />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            <Conversation className="flex-1">
              <ConversationContent className="space-y-6 p-6">
                {chatHistory.map((msg, index) => (
                  <ChatMessage key={index} message={msg} />
                ))}
                {isLoading && currentResponse && (
                  <ChatMessage
                    message={{
                      type: 'assistant',
                      content: currentResponse,
                      timestamp: new Date(),
                      model: selectedModel
                    }}
                  />
                )}
                {isLoading && !currentResponse && (
                  <div className="flex items-center justify-center gap-3 p-8">
                    <Loader className="size-5" />
                    <span className="text-muted-foreground">Creating your app...</span>
                  </div>
                )}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>
          </div>
        )}
      </div>
      
      <div className="bg-transparent backdrop-blur-sm w-full flex justify-center">
        <div className="w-full max-w-2xl">
          <PromptInput onSubmit={handleSubmit} className="border-0 shadow-none">
            <PromptInputTextarea
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
              value={message}
              placeholder="Describe the app you want to build..."
              className="min-h-[60px] text-base px-4 py-3 rounded-t-lg rounded-b-none"
            />
            <div className="px-4 pb-3 rounded-b-lg bg-background/30">
            <PromptInputToolbar className="mt-2">
              <PromptInputModelSelect value={selectedModel} onValueChange={onModelChange}>
                <PromptInputModelSelectTrigger className="w-auto">
                  <PromptInputModelSelectValue placeholder="Select a model" />
                </PromptInputModelSelectTrigger>
                <PromptInputModelSelectContent>
                  {Object.entries(MODELS).map(([id, model]) => (
                    <PromptInputModelSelectItem key={id} value={id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{model.name}</span>
                        <span className="text-xs text-muted-foreground">{model.description}</span>
                      </div>
                    </PromptInputModelSelectItem>
                  ))}
                </PromptInputModelSelectContent>
              </PromptInputModelSelect>
              <PromptInputSubmit disabled={isLoading || !message.trim()} />
            </PromptInputToolbar>
          </div>
          </PromptInput>
        </div>
      </div>
    </Card>
  );
}
