export type MessageRole = 'user' | 'assistant' | 'system';

// For chat messages in the UI
export interface MessageType {
  type: 'user' | 'assistant';
  content: string;
  id?: string;
}

// For API communication
export interface Message {
  id?: string;
  role: MessageRole;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  model: string;
}

export interface ChatState {
  currentChatId: string | null;
  chats: Chat[];
  isLoading: boolean;
  error: string | null;
}

export interface ModelInfo {
  id: string;
  name: string;
  description: string;
  context: string;
  isFree?: boolean;
  maxTokens?: number;
}
