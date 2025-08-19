'use client';

import { Header, ChatInterface, PreviewPanel } from '@/components/app';
import { useChat } from '@/hooks/use-chat';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

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
    <div className="h-screen bg-background text-foreground flex flex-col">
      <Header />
      <div className="flex-1 overflow-hidden bg-grid-pattern">
        {htmlContent ? (
          <ResizablePanelGroup direction="horizontal" className="w-full h-full p-4 gap-4">
            <ResizablePanel defaultSize={50} minSize={30} className="min-w-[300px] overflow-auto rounded-lg border shadow-sm">
              <div className="h-full flex flex-col">
                <ChatInterface
                  chatHistory={formattedMessages}
                  isLoading={isLoading}
                  onSendMessage={handleSendMessage}
                  currentResponse={currentResponse}
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle className="bg-transparent" />
            <ResizablePanel defaultSize={50} minSize={30} className="min-w-[300px] rounded-lg border shadow-sm">
              <div className="h-full overflow-auto">
                <PreviewPanel dataUrl={dataUrl} htmlContent={htmlContent} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="h-full max-w-5xl mx-auto">
            <ChatInterface
              chatHistory={formattedMessages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              currentResponse={currentResponse}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
            />
          </div>
        )}
      </div>
    </div>
  );
}