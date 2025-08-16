import { createAI } from '@ai-sdk/rsc';
import { sendMessage } from './actions';
import { AIState, UIState } from './types';

// Create the AI provider with the initial states and allowed actions.
export const AI = createAI<AIState, UIState>({
  actions: {
    sendMessage,
  },
  initialUIState: [],
  initialAIState: [],
});