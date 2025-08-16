import type { ReactNode } from 'react';

// Define the AI state and UI state types
export type AIState = Array<{
  role: 'user' | 'assistant';
  content: string;
}>;

export type UIState = Array<{
  id: string;
  role: 'user' | 'assistant';
  display: ReactNode;
}>;

export interface Message {
  type: 'user' | 'assistant';
  content: string;
}

export interface ClientChat {
  id: string;
  demo: string;
}
