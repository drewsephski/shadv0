import { useState, useCallback, useEffect } from 'react';
import { ChatService } from '@/services/chat-service';
import { MessageType } from '@/types/chat';
import { RefinementType } from '@/types/refinement';
import { LoadingStage } from '@/app/types';
import { loadingStages } from '@/components/app/ui/LoadingScreen';
import { useVersionHistory } from './useVersionHistory';

export const useChat = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [dataUrl, setDataUrl] = useState('');
  const [templateHtml, setTemplateHtml] = useState('');
  const [selectedModel, setSelectedModel] = useState('glm-4.5-air');
  const [currentResponse, setCurrentResponse] = useState('');
  const [refinementPrompt, setRefinementPrompt] = useState<string | null>(null);
  const [currentLoadingStage, setCurrentLoadingStage] = useState<LoadingStage | null>(null);

  const { addVersion } = useVersionHistory();

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
      setCurrentLoadingStage(loadingStages[0]); // Initializing Generator

      // Add the user message to the UI immediately
      addMessage('user', userMessage);

      // Simulate progress for scaffolding
      let progressInterval: NodeJS.Timeout | null = null; // Declare here and initialize to null
      setTimeout(() => setCurrentLoadingStage(loadingStages[1]), 500);

      // Determine if this is a refinement request
      const isRefinement = refinementPrompt !== null;
      const existingHtml = isRefinement ? htmlContent : templateHtml || undefined;

      // For the first message or refinement, initialize the preview with a loading state (handled by LoadingScreen now)
      // No need to set htmlContent or dataUrl here, LoadingScreen will cover the UI

      try {
        // Prepare messages for the API call
        const apiMessages = [
          ...messages.map(m => ({
            role: m.type === 'user' ? 'user' as const : 'assistant' as const,
            content: m.content
          })),
          { role: 'user' as const, content: userMessage }
        ];

        // Simulate progress for styling and wiring components during streaming
        let currentProgressIndex = 2; // Start from 'styling' - declare outside setInterval
        progressInterval = setInterval(() => {
          if (currentProgressIndex < loadingStages.length - 2) { // Don't go to finalizing or complete here
            setCurrentLoadingStage(loadingStages[currentProgressIndex]);
            currentProgressIndex++;
          } else {
            clearInterval(progressInterval!);
            progressInterval = null;
          }
        }, 2000); // Update stage every 2 seconds

        // Call the chat service to get the response
        await ChatService.generateWebsite(
          {
            messages: apiMessages,
            model,
            existingHtml, // Pass existing HTML for refinement
          },
          (chunk) => {
            setCurrentResponse((prev) => {
              const newResponse = prev + chunk;
              
              // Update the preview if HTML content is present in the stream
              if (newResponse.includes('<!DOCTYPE html>')) {
                const htmlMatch = newResponse.match(/```(?:html)?\n([\s\S]*?)\n```/);
                const streamedHtml = htmlMatch ? htmlMatch[1] : newResponse;
                
                setHtmlContent(streamedHtml);
                setDataUrl('data:text/html;charset=utf-8,' +
                  encodeURIComponent(streamedHtml));
              }
              
              return newResponse;
            });
          },
          () => {
            // When the response is complete, add it to the messages
            addMessage('assistant', currentResponse);

            // Add completion message
            addMessage('assistant', '✅ Code generation completed! Your website is ready to preview.');

            // Ensure the preview is up to date with the final HTML
            if (currentResponse) {
              const htmlMatch = currentResponse.match(/```(?:html)?\n([\s\S]*?)\n```/);
              const finalHtml = htmlMatch ? htmlMatch[1] : currentResponse;

              setHtmlContent(finalHtml);
              setDataUrl('data:text/html;charset=utf-8,' +
                encodeURIComponent(finalHtml));
              
              // Add version to history
              addVersion(finalHtml, userMessage);
            }

            setCurrentResponse('');
            setIsLoading(false);
            setRefinementPrompt(null); // Clear refinement prompt after completion
            setCurrentLoadingStage(loadingStages[loadingStages.length - 1]); // Set to complete
            if (progressInterval) {
              clearInterval(progressInterval);
              progressInterval = null;
            }
          },
          (error: string) => {
            console.error('Error generating website:', error);
            setError(error);
            addMessage('assistant', `Sorry, there was an error: ${error}`);
            setIsLoading(false);
            setRefinementPrompt(null); // Clear refinement prompt on error
            setCurrentLoadingStage(null); // Clear loading stage on error
            if (progressInterval) {
              clearInterval(progressInterval);
              progressInterval = null;
            }
          }
        );
      } catch (error) {
        console.error('Error sending message:', error);
        setError('Failed to send message');
        setIsLoading(false);
        setRefinementPrompt(null); // Clear refinement prompt on error
        setCurrentLoadingStage(null); // Clear loading stage on error
        if (progressInterval) {
          clearInterval(progressInterval);
          progressInterval = null;
        }
      }
    },
    [selectedModel, addMessage, refinementPrompt, htmlContent, templateHtml, messages, currentResponse]
  );

  useEffect(() => {
    return () => {
      // No need to clear progressInterval here if it's declared within useCallback
      // If it was declared outside, then it would need to be cleared here
    };
  }, []);

  const handleRefinementRequest = useCallback(async (
    type: RefinementType,
    prompt?: string,
    originalHtml?: string
  ) => {
    const refinementMessage = prompt || `Please refine this HTML content with ${type} improvements: ${originalHtml}`;

    // Add a user message for the refinement request
    addMessage('user', refinementMessage);

    setIsLoading(true);
    setError(null);
    setCurrentResponse('');
    setCurrentLoadingStage(loadingStages[0]); // Initializing Generator for refinement

    // Simulate progress for scaffolding
    setTimeout(() => setCurrentLoadingStage(loadingStages[1]), 500);

    try {
      await ChatService.generateWebsite(
        {
          messages: [
            ...messages.map(m => ({
              role: m.type === 'user' ? 'user' as const : 'assistant' as const,
              content: m.content
            })),
            { role: 'user' as const, content: refinementMessage }
          ],
          model: selectedModel,
          existingHtml: originalHtml, // Pass existing HTML for refinement
        },
        (chunk) => {
          setCurrentResponse((prev) => prev + chunk);
        },
        () => {
          // When refinement is complete, add it to messages
          // When refinement is complete, add it to messages
          addMessage('assistant', currentResponse);
          addMessage('assistant', '✅ Refinement completed! Your website has been improved.');
          
          // Add version to history after successful refinement
          addVersion(htmlContent, refinementMessage);

          setCurrentResponse('');
          setIsLoading(false);
          setCurrentLoadingStage(loadingStages[loadingStages.length - 1]); // Set to complete
        },
        (error: string) => {
          console.error('Error during refinement:', error);
          setError(error);
          addMessage('assistant', `Sorry, there was an error during refinement: ${error}`);
          setIsLoading(false);
          setCurrentLoadingStage(null); // Clear loading stage on error
        }
      );
    } catch (error) {
      console.error('Error sending refinement request:', error);
      setError('Failed to send refinement request');
      setIsLoading(false);
      setCurrentLoadingStage(null); // Clear loading stage on error
    }
  }, [addMessage, messages, selectedModel, currentResponse]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setHtmlContent('');
    setDataUrl('');
    setError(null);
    setCurrentLoadingStage(null); // Clear loading stage on clear chat
  }, []);

  const restoreHtmlContent = useCallback((html: string) => {
    setHtmlContent(html);
    setDataUrl('data:text/html;charset=utf-8,' + encodeURIComponent(html));
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
    handleRefinementRequest,
    clearChat,
    restoreHtmlContent, // Expose the new restore function
    currentResponse,
    refinementPrompt,
    setRefinementPrompt,
    templateHtml,
    setTemplateHtml,
    currentLoadingStage,
  };
};
