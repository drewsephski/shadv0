import { useState, useCallback } from 'react';
import { ChatService } from '@/services/chat-service';
import { MessageType } from '@/types/chat';

export const useChat = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [dataUrl, setDataUrl] = useState('');
  const [selectedModel, setSelectedModel] = useState('glm-4.5-air');
  const [currentResponse, setCurrentResponse] = useState('');

  const addMessage = useCallback((type: 'user' | 'assistant', content: string) => {
    const newMessage: MessageType = {
      id: Date.now().toString(),
      type,
      content,
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const handleStreamingResponse = useCallback(
    async (userMessage: string, model: string = selectedModel) => {
      setIsLoading(true);
      setError(null);
      setCurrentResponse('');
      
      // Add the user message to the UI immediately
      addMessage('user', userMessage);

      const isFirstMessage = messages.length === 0;
      
      // For the first message, initialize the preview with a loading state
      if (isFirstMessage) {
        const loadingHtml = '<!DOCTYPE html><html><head><title>Loading...</title><style>body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }</style></head><body><div>Generating your website preview...</div></body></html>';
        setHtmlContent(loadingHtml);
        setDataUrl('data:text/html;charset=utf-8,' + encodeURIComponent(loadingHtml));
      }

      try {
        // Call the chat service to get the response
        await ChatService.generateWebsite(
          {
            messages: [
              ...messages.map(m => ({
                role: m.type === 'user' ? 'user' as const : 'assistant' as const,
                content: m.content
              })),
              { role: 'user' as const, content: userMessage }
            ],
            model,
          },
          (chunk) => {
            setCurrentResponse((prev) => {
              const newResponse = prev + chunk;
              
              // If this is the first message and we have HTML content, update the preview
              if (isFirstMessage && newResponse.includes('<!DOCTYPE html>')) {
                // Extract the HTML content from the response
                const htmlMatch = newResponse.match(/```(?:html)?\n([\s\S]*?)\n```/);
                const htmlContent = htmlMatch ? htmlMatch[1] : newResponse;
                
                setHtmlContent(htmlContent);
                setDataUrl('data:text/html;charset=utf-8,' + 
                  encodeURIComponent(htmlContent));
              }
              
              return newResponse;
            });
          },
          () => {
            // When the response is complete, add it to the messages
            addMessage('assistant', currentResponse);
            
            // If this was the first message, ensure the preview is up to date
            if (isFirstMessage && currentResponse) {
              const htmlMatch = currentResponse.match(/```(?:html)?\n([\s\S]*?)\n```/);
              const finalHtml = htmlMatch ? htmlMatch[1] : currentResponse;
              
              setHtmlContent(finalHtml);
              setDataUrl('data:text/html;charset=utf-8,' + 
                encodeURIComponent(finalHtml));
            }
            
            setCurrentResponse('');
            setIsLoading(false);
          },
          (error: string) => {
            console.error('Error generating website:', error);
            setError(error);
            addMessage('assistant', `Sorry, there was an error: ${error}`);
            setIsLoading(false);
          }
        );
      } catch (error) {
        console.error('Error sending message:', error);
        setError('Failed to send message');
        setIsLoading(false);
      }
    },
    [addMessage, messages, selectedModel, currentResponse]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setHtmlContent('');
    setDataUrl('');
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    htmlContent,
    dataUrl,
    selectedModel,
    setSelectedModel,
    sendMessage: handleStreamingResponse,
    clearChat,
    currentResponse,
  };
};
