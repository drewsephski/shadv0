'use client';

import { useCallback, useState } from 'react';
import { Header, ChatInterface, PreviewPanel } from '@/components/app';
import { useChat } from '@/hooks/use-chat';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Component as RaycastAnimatedBlueBackground } from '@/components/ui/raycast-animated-blue-background';
import { LoadingScreen } from '@/components/app/ui/LoadingScreen';
import { VersionHistoryModal } from '@/components/app/ui/VersionHistoryModal';
import { useVersionHistory } from '@/hooks/useVersionHistory';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';

export default function Home() {
  const {
    messages: chatHistory,
    isLoading,
    htmlContent,
    dataUrl,
    selectedModel,
    setSelectedModel,
    sendMessage: handleSendMessage,
    handleRefinementRequest,
    clearChat,
    currentResponse,
    refinementPrompt,
    setRefinementPrompt,
    setTemplateHtml,
    currentLoadingStage,
    restoreHtmlContent,
  } = useChat();

  const { getVersions, getVersion, deleteVersion } = useVersionHistory();
  const [isVersionHistoryModalOpen, setIsVersionHistoryModalOpen] = useState(false);

  const handleRestoreVersion = useCallback((id: string) => {
    const version = getVersion(id);
    if (version) {
      restoreHtmlContent(version.htmlContent);
      setIsVersionHistoryModalOpen(false); // Close modal after restoring
    }
  }, [getVersion, restoreHtmlContent]);

  const handleViewVersion = useCallback((htmlContent: string) => {
    // For simplicity, we'll just set the current HTML content to the selected version's HTML
    // In a more complex scenario, you might open a new preview window or a diff viewer
    restoreHtmlContent(htmlContent);
    setIsVersionHistoryModalOpen(false);
  }, [restoreHtmlContent]);

  const handleTemplateSelect = useCallback((data: { prompt: string; htmlCode: string }) => {
    setRefinementPrompt(data.prompt);
    setTemplateHtml(data.htmlCode);
  }, [setRefinementPrompt, setTemplateHtml]);

  const formattedMessages = chatHistory.map((msg) => ({
    type: msg.type as 'user' | 'assistant',
    content: msg.content,
    timestamp: new Date(),
    model: msg.type === 'assistant' ? selectedModel : undefined,
  }));

  const handleRefineCode = (code: string) => {
    setRefinementPrompt(code);
  };

  return (
    <div className="h-screen bg-background text-foreground flex flex-col relative">
      <RaycastAnimatedBlueBackground />
      <Header onNewChat={clearChat} />
      <div className="relative flex-1 overflow-hidden bg-grid-pattern">
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsVersionHistoryModalOpen(true)}
            className="flex items-center gap-2"
          >
            <History className="size-4" />
            Version History
          </Button>
        </div>
        {isLoading && !htmlContent && currentLoadingStage ? (
          <LoadingScreen currentStage={currentLoadingStage} brandingText="Kilo Code" />
        ) : htmlContent ? (
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
                  refinementPrompt={refinementPrompt}
                  onSelectTemplateData={handleTemplateSelect}
                />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle className="bg-transparent" />
            <ResizablePanel defaultSize={50} minSize={30} className="min-w-[300px] rounded-lg border shadow-sm">
              <div className="h-full overflow-auto">
                <PreviewPanel
                  dataUrl={dataUrl}
                  htmlContent={htmlContent}
                  onRefineCode={handleRefineCode}
                  onRefinementRequest={handleRefinementRequest}
                  selectedModel={selectedModel}
                  onElementSelect={(outerHtml) => setRefinementPrompt(`Refine this element: ${outerHtml}`)}
                />
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
              refinementPrompt={refinementPrompt}
              onSelectTemplateData={handleTemplateSelect}
            />
          </div>
        )}
      </div>
      <VersionHistoryModal
        isOpen={isVersionHistoryModalOpen}
        onClose={() => setIsVersionHistoryModalOpen(false)}
        versions={getVersions()}
        onRestore={handleRestoreVersion}
        onDelete={deleteVersion}
        onView={handleViewVersion}
      />
    </div>
  );
}