import { ApiClient } from '@/lib/api-client';
import { MessageRole } from '@/types/chat';
import { MODELS } from '@/constants/models';

export interface GenerateWebsiteParams {
  messages: { role: MessageRole; content: string }[];
  model: string;
  existingHtml?: string; // Add this line for refinement
}

export class ChatService {
  static async generateWebsite(
    params: GenerateWebsiteParams,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: string) => void
  ) {
    console.log('ChatService.generateWebsite called with params:', params);
    
    try {
      // Validate messages parameter
      if (!params.messages || !Array.isArray(params.messages)) {
        throw new Error('Messages must be an array');
      }

      // Ensure each message has required fields and correct types
      const apiMessages = params.messages.map(msg => {
        // Ensure content is a string
        const content = typeof msg.content === 'string' ? msg.content : String(msg.content);
        
        // Validate and set role
        const role = msg.role === 'user' ? 'user' : 
                    msg.role === 'assistant' ? 'assistant' : 
                    'user'; // Default to 'user' if role is invalid
        
        return { role, content };
      });

      console.log('ChatService: Sending API request with messages:', apiMessages);

      // Get the full model ID from the MODELS configuration
      const modelKey = params.model || 'llama-3.3-70b';
      const modelConfig = MODELS[modelKey as keyof typeof MODELS];
      
      if (!modelConfig) {
        throw new Error(`The model '${modelKey}' is not available.`);
      }

      // Ensure we're only sending the required fields to the API
      const requestBody = {
        messages: apiMessages,
        model: modelKey, // The API will resolve this to the full model ID
        ...(params.existingHtml && { existingHtml: params.existingHtml }), // Conditionally add existingHtml
      };
      
      console.log('Using model:', { modelKey, modelId: modelConfig.id });

      return ApiClient.streamResponse(
        '/api/generate',
        requestBody,
        onChunk,
        onComplete,
        (error) => {
          console.error('ChatService: API request failed:', error);
          onError(typeof error === 'string' ? error : 'An error occurred while generating the response');
        }
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('ChatService: Error in generateWebsite:', error);
      onError(errorMessage);
    }
  }

  // Add other chat-related methods here
  // Example:
  // static async getChats() { ... }
  // static async getChat(id: string) { ... }
  // static async saveChat(chat: Partial<Chat>) { ... }
  // static async deleteChat(id: string) { ... }
}

