import { useState } from 'react';
import { PromptInput, PromptInputSubmit, PromptInputTextarea } from '@/components/ai-elements/prompt-input';
import { Conversation, ConversationContent } from '@/components/ai-elements/conversation';
import { Loader } from '@/components/ai-elements/loader';
import { Suggestions, Suggestion } from '@/components/ai-elements/suggestion';
import { EmptyState } from './EmptyState';
import { ChatMessage } from './ChatMessage';

type MessageType = {
  type: 'user' | 'assistant';
  content: string;
};

type ChatInterfaceProps = {
  chatHistory: MessageType[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
};

export function ChatInterface({ chatHistory, isLoading, onSendMessage }: ChatInterfaceProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    onSendMessage(message.trim());
    setMessage('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <Conversation>
              <ConversationContent>
                {chatHistory.map((msg, index) => (
                  <ChatMessage key={index} message={msg} />
                ))}
              </ConversationContent>
            </Conversation>
            {isLoading && (
              <div className="flex items-center gap-2 p-4">
                <Loader />
                <span>Creating your app...</span>
              </div>
            )}
          </>
        )}
      </div>
      <div className="border-t p-4">
        {chatHistory.length === 0 && (
          <Suggestions>
            <Suggestion
              suggestion="Create a responsive navbar with Tailwind CSS"
              onClick={() => setMessage('Create a responsive navbar with Tailwind CSS')}
            >
              Create a responsive navbar with Tailwind CSS
            </Suggestion>
            <Suggestion
              suggestion="Build a todo app with React"
              onClick={() => setMessage('Build a todo app with React')}
            >
              Build a todo app with React
            </Suggestion>
            <Suggestion
              suggestion="Make a landing page for a coffee shop"
              onClick={() => setMessage('Make a landing page for a coffee shop')}
            >
              Make a landing page for a coffee shop
            </Suggestion>
          </Suggestions>
        )}
        <PromptInput
          onSubmit={handleSubmit}
          className="flex gap-2 mt-4 w-full max-w-2xl mx-auto relative"
        >
          <PromptInputTextarea
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
            value={message}
            className="pr-12 min-h-[60px]"
          />
          <PromptInputSubmit
            className="absolute bottom-1 right-1"
            disabled={!message || isLoading}
            status={isLoading ? 'streaming' : 'ready'}
          />
        </PromptInput>
      </div>
    </div>
  );
}
