'use server';

import { getMutableAIState, streamUI } from '@ai-sdk/rsc';
import { openai } from '@ai-sdk/openai';
import { AIState, UIState } from './types';

export async function sendMessage(input: string): Promise<UIState[number]> {
  const history = getMutableAIState();

  const result = await streamUI({
    model: openai('gpt-4-turbo-preview'),
    messages: [...history.get(), { role: 'user', content: input }],
    text: ({ content, done }) => {
      if (done) {
        const newMessages: AIState = [
          ...history.get(),
          { role: 'assistant', content },
        ];
        history.done(newMessages);
      }
      return <div>{content}</div>;
    },
  });

  return {
    id: Date.now().toString(),
    role: 'assistant',
    display: result.value,
  };
}
