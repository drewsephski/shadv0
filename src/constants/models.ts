import { ModelInfo } from '@/types/chat';

export const MODELS: Record<string, ModelInfo> = {
  'glm-4.5-air': {
    id: 'z-ai/glm-4.5-air:free',
    name: 'GLM-4.5 Air',
    description: 'Efficient and powerful model from Zhipu AI',
    context: '32K',
    isFree: true,
    maxTokens: 32768,
  },
  'llama-3.3-70b': {
    id: 'meta-llama/llama-3.3-70b-instruct:free',
    name: 'Llama 3.3 70B',
    description: 'Latest and most powerful free model from Meta',
    context: '8K',
    isFree: true,
    maxTokens: 8192,
  },
  'mistral-7b': {
    id: 'mistralai/mistral-7b-instruct:free',
    name: 'Mistral 7B Instruct',
    description: 'Efficient 7B parameter model from Mistral AI',
    context: '8K',
    isFree: true,
    maxTokens: 8192,
  },
  'mixtral-8x7b': {
    id: 'mistralai/mixtral-8x7b-instruct:free',
    name: 'Mixtral 8x7B',
    description: 'High-quality mixture of experts model',
    context: '32K',
    isFree: true,
    maxTokens: 32768,
  },
  'deepseek-chat-v3': {
    id: 'deepseek-ai/deepseek-chat-v3',
    name: 'DeepSeek Chat V3',
    description: 'Advanced model from DeepSeek',
    context: '8K',
    isFree: true,
    maxTokens: 8192,
  }
} as const;

export const DEFAULT_MODEL = 'glm-4.5-air';

export const FREE_MODELS = Object.values(MODELS).filter(model => model.isFree);
export const PREMIUM_MODELS = Object.values(MODELS).filter(model => !model.isFree);

export function getModelInfo(modelId: string): ModelInfo {
  return MODELS[modelId] || MODELS[DEFAULT_MODEL];
}
