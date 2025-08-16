import { useState } from 'react';
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
  ConversationScrollButton 
} from '@/components/ai-elements/conversation';
import { Loader } from '@/components/ai-elements/loader';
import { Suggestions, Suggestion } from '@/components/ai-elements/suggestion';
import { EmptyState } from './EmptyState';
import { ChatMessage } from './ChatMessage';
import { MODELS } from '@/constants/models';
import { Card } from '@/components/ui/card';

type MessageType = {
  type: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  model?: string;
};

type ChatInterfaceProps = {
  chatHistory: MessageType[];
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    onSendMessage(message.trim(), selectedModel);
    setMessage('');
  };

  const suggestions = [
    {
      title: "A responsive navbar",
      description: "Build a modern navigation bar with Tailwind CSS",
      prompt: "Create a responsive navbar with Tailwind CSS that includes a logo, navigation links, and a mobile hamburger menu"
    },
    {
      title: "Generate a todo app",
      description: "Create a functional todo application with React",
      prompt: "Build a todo app with React that includes add, edit, delete, and mark as complete functionality"
    },
    {
      title: "Design a landing page",
      description: "Make an attractive landing page for a business",
      prompt: "Make a modern landing page for a coffee shop with hero section, menu, and contact information"
    },
    {
      title: "Create a dashboard",
      description: "Build an admin dashboard with charts and tables",
      prompt: "Create a modern admin dashboard with sidebar navigation, charts, and data tables using React and Tailwind CSS"
    }
  ];

  return (
    <Card className="flex flex-col h-full border-0 shadow-none bg-transparent">
      <div className="flex-1 flex flex-col min-h-0">
        {chatHistory.length === 0 ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-shrink-0">
              <EmptyState />
            </div>
            <div className="flex-1 flex items-center justify-center px-6 py-4 min-h-0">
              <div className="w-full max-w-5xl mx-auto">
                <h3 className="text-lg font-semibold mb-6 text-center">Try these examples</h3>
                <div className="flex justify-center">
                  <Suggestions className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl w-full">
                    {suggestions.map((suggestion, index) => (
                      <Suggestion
                        key={index}
                        suggestion={suggestion.prompt}
                        onClick={() => setMessage(suggestion.prompt)}
                        className="p-5 text-left border rounded-xl hover:bg-accent/50 hover:border-primary/20 transition-all duration-200 cursor-pointer group hover:shadow-md hover:scale-[1.01] animate-fade-in w-full"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="font-medium text-sm group-hover:text-primary transition-colors">
                          {suggestion.title}
                        </div>
                        <div className="text-xs text-muted-foreground leading-relaxed">
                          {suggestion.description}
                        </div>
                      </Suggestion>
                    ))}
                  </Suggestions>
                </div>
              </div>
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
      
      <div className="border-t bg-background/50 backdrop-blur-sm p-4">
        <div className="max-w-3xl mx-auto">
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputTextarea
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
              value={message}
              placeholder="Describe the app you want to build..."
              className="min-h-[60px] text-base"
            />
            <PromptInputToolbar>
              <PromptInputModelSelect value={selectedModel} onValueChange={onModelChange}>
                <PromptInputModelSelectTrigger className="w-auto">
                  <PromptInputModelSelectValue placeholder="Select model" />
                </PromptInputModelSelectTrigger>
                <PromptInputModelSelectContent>
                  {Object.entries(MODELS).map(([key, model]) => (
                    <PromptInputModelSelectItem key={key} value={key}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{model.name}</span>
                        <span className="text-xs text-muted-foreground">{model.description}</span>
                      </div>
                    </PromptInputModelSelectItem>
                  ))}
                </PromptInputModelSelectContent>
              </PromptInputModelSelect>
              <PromptInputSubmit
                disabled={!message.trim() || isLoading}
                status={isLoading ? 'streaming' : undefined}
              />
            </PromptInputToolbar>
          </PromptInput>
        </div>
      </div>
    </Card>
  );
}
