'use client';

import { Header, ChatInterface, PreviewPanel } from '@/components/app';
import { useChat } from '@/hooks/use-chat';
import { cn } from '@/lib/utils';

export default function Home() {
  const {
    messages: chatHistory,
    isLoading,
    htmlContent,
    dataUrl,
    selectedModel,
    setSelectedModel,
    sendMessage: handleSendMessage,
    currentResponse,
  } = useChat();

  const formattedMessages = chatHistory.map((msg) => ({
    type: msg.type as 'user' | 'assistant',
    content: msg.content,
    timestamp: new Date(),
    model: msg.type === 'assistant' ? selectedModel : undefined,
  }));

  return (
    <div className="h-screen bg-gradient-to-br from-background via-background to-muted/20 text-foreground flex flex-col">
      <Header />
      <div className="flex-1 flex gap-1 p-1">
        <div className={cn(
          "flex flex-col transition-all duration-500 ease-in-out animate-fade-in",
          htmlContent ? "w-1/2" : "w-full max-w-5xl mx-auto"
        )}>
          <ChatInterface
            chatHistory={formattedMessages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            currentResponse={currentResponse}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
        </div>
        {htmlContent && (
          <div className="w-1/2 transition-all duration-500 ease-in-out animate-slide-up">
            <PreviewPanel dataUrl={dataUrl} htmlContent={htmlContent} />
          </div>
        )}
      </div>
    </div>
  );
}