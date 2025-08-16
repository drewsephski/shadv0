import { useState, useCallback } from 'react';
import { ChatService } from '@/services/chat-service';
import { MessageType } from '@/types/chat';

export const useChat = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [dataUrl, setDataUrl] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');

  const addMessage = useCallback((type: 'user' | 'assistant', content: string) => {
    const newMessage: MessageType = {
      id: Date.now().toString(),
      type,
      content,
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const handleStreamingResponse = useCallback(
    (userMessage: string) => {
      setIsLoading(true);
      setError(null);
      setHtmlContent('');
      addMessage('user', userMessage);

      ChatService.generateWebsite(
        {
          messages: [
            ...messages.map(m => ({ role: m.type, content: m.content })),
            { role: 'user' as const, content: userMessage },
          ],
          model: selectedModel,
        },
        (chunk: string) => {
          setHtmlContent(prev => {
            const newHtml = prev + chunk;
            const newDataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(newHtml)}`;
            setDataUrl(newDataUrl);
            return newHtml;
          });
        },
        () => {
          addMessage('assistant', 'Here is the website I created:');
          addMessage('assistant', 'Generated new app preview. Check the preview panel!');
          setIsLoading(false);
        },
        (error: string) => {
          console.error('Error generating website:', error);
          setError(error);
          addMessage('assistant', `Sorry, there was an error: ${error}`);
          setIsLoading(false);
        }
      );
    },
    [addMessage, messages, selectedModel]
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
  };
};
