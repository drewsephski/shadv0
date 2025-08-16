import { Message as MessageComponent } from "@/components/ai-elements/message";

type MessageType = {
  type: 'user' | 'assistant';
  content: string;
};

type ChatMessageProps = {
  message: MessageType;
};

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <MessageComponent from={message.type}>
      {message.content}
    </MessageComponent>
  );
}
