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
    (userMessage: string) => {
      setIsLoading(true);
      setError(null);
      setHtmlContent('');
      setCurrentResponse('');
      
      // Add the user message to the UI immediately
      addMessage('user', userMessage);

      console.log('useChat: Sending message:', userMessage);
      console.log('useChat: Current messages:', messages);
      
      // Convert UI messages to API message format and include the current message
      const apiMessages: { role: 'user' | 'assistant'; content: string }[] = [
        ...messages.map(m => ({
          role: m.type === 'user' ? 'user' as const : 'assistant' as const,
          content: m.content
        })),
        { role: 'user' as const, content: userMessage }
      ];

      console.log('useChat: Sending API messages:', apiMessages);

      ChatService.generateWebsite(
        {
          messages: apiMessages,
          model: selectedModel,
        },
        (chunk: string) => {
          setHtmlContent(prev => {
            const newHtml = prev + chunk;
            const newDataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(newHtml)}`;
            setDataUrl(newDataUrl);
            return newHtml;
          });
          setCurrentResponse(prev => prev + chunk);
        },
        () => {
          addMessage('assistant', currentResponse);
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
