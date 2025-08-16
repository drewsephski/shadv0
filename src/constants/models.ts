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
  'llama-3.1-405b': {
    id: 'meta-llama/llama-3.1-405b-instruct:free',
    name: 'Llama 3.1 405B',
    description: 'Massive 405B parameter model from Meta',
    context: '8K',
    isFree: true,
    maxTokens: 8192,
  },
  'mixtral-8x7b': {
    id: 'mistralai/mistral-7b-instruct:free',
    name: 'Mistral 7B',
    description: 'High-quality model from Mistral AI',
    context: '8K',
    isFree: true,
    maxTokens: 8192,
  },
  'gemini-2.0-flash': {
    id: 'google/gemini-2.0-flash-exp:free',
    name: 'Gemini 2.0 Flash',
    description: 'Fast and capable model from Google',
    context: '8K',
    isFree: true,
    maxTokens: 8192,
  },
  'deepseek-chat-v3': {
    id: 'deepseek/deepseek-chat-v3-0324:free',
    name: 'DeepSeek Chat V3',
    description: 'Advanced model from DeepSeek',
    context: '8K',
    isFree: true,
    maxTokens: 8192,
  },
  'qwen3-8b': {
    id: 'qwen/qwen3-8b:free',
    name: 'Qwen3 8B',
    description: 'Latest Qwen model from Alibaba',
    context: '8K',
    isFree: true,
    maxTokens: 8192,
  },
  'qwen2.5-vl-72b': {
    id: 'qwen/qwen2.5-vl-72b-instruct:free',
    name: 'Qwen2.5 VL 72B',
    description: 'Large vision-language model from Alibaba',
    context: '32K',
    isFree: true,
    maxTokens: 32768,
  },
  'shisa-v2-llama3.3-70b': {
    id: 'shisa-ai/shisa-v2-llama3.3-70b:free',
    name: 'Shisa V2 (Llama 3.3 70B)',
    description: 'High-quality fine-tuned Llama 3.3 model',
    context: '8K',
    isFree: true,
    maxTokens: 8192,
  },
} as const;

export const DEFAULT_MODEL = 'glm-4.5-air';

export const FREE_MODELS = Object.values(MODELS).filter(model => model.isFree);
export const PREMIUM_MODELS = Object.values(MODELS).filter(model => !model.isFree);

export function getModelInfo(modelId: string): ModelInfo {
  return MODELS[modelId] || MODELS[DEFAULT_MODEL];
}
