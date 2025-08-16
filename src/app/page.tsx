'use client';

import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Header, ChatInterface, PreviewPanel } from '@/components/app';
import { useChat } from '@/hooks/use-chat';

export default function Home() {
  const {
    messages: chatHistory,
    isLoading,
    htmlContent,
    dataUrl,
    selectedModel,
    setSelectedModel,
    sendMessage: handleSendMessage,
  } = useChat();

  // Convert MessageType[] to the expected format for ChatInterface
  const formattedMessages = chatHistory.map(msg => ({
    type: msg.type as 'user' | 'assistant',
    content: msg.content,
  }));

  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      <Header model={selectedModel} onModelChange={setSelectedModel} />
      
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={50}>
          <ChatInterface 
            chatHistory={formattedMessages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={50}>
          <PreviewPanel 
            dataUrl={dataUrl}
            htmlContent={htmlContent}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}