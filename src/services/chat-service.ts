import { ApiClient } from '@/lib/api-client';
import { MessageRole } from '@/types/chat';

export interface GenerateWebsiteParams {
  messages: { role: MessageRole; content: string }[];
  model: string;
}

export class ChatService {
  static async generateWebsite(
    params: GenerateWebsiteParams,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: string) => void
  ) {
    console.log('ChatService.generateWebsite called with params:', params);
    
    // Validate messages parameter
    if (!params.messages || !Array.isArray(params.messages)) {
      console.error('ChatService: Messages validation failed:', params.messages);
      onError('Messages must be an array');
      return;
    }

    // Convert UI message types to API message roles
    const apiMessages = params.messages.map(msg => ({
      role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
      content: msg.content
    }));

    console.log('ChatService: Converted API messages:', apiMessages);

    return ApiClient.streamResponse(
      '/generate',
      { ...params, messages: apiMessages },
      onChunk,
      onComplete,
      onError
    );
  }

  // Add other chat-related methods here
  // Example:
  // static async getChats() { ... }
  // static async getChat(id: string) { ... }
  // static async saveChat(chat: Partial<Chat>) { ... }
  // static async deleteChat(id: string) { ... }
}

