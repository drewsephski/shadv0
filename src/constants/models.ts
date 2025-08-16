import { ModelInfo } from '@/types/chat';

export const MODELS: Record<string, ModelInfo> = {
  'gpt-3.5-turbo': {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and capable model from OpenAI, great balance of speed and quality',
    context: '16K',
    isFree: true,
    maxTokens: 16384,
  },
  'llama-3.1-8b': {
    id: 'llama-3.1-8b',
    name: 'Llama 3.1 8B',
    description: 'Efficient model from Meta, good for most tasks',
    context: '8K',
    isFree: true,
    maxTokens: 8192,
  },
  'llama-3.1-70b': {
    id: 'llama-3.1-70b',
    name: 'Llama 3.1 70B',
    description: 'More powerful but slower model from Meta',
    context: '8K',
    isFree: true,
    maxTokens: 8192,
  },
  'mixtral-8x7b': {
    id: 'mixtral-8x7b',
    name: 'Mixtral 8x7B',
    description: 'High-quality model from Mistral AI',
    context: '32K',
    isFree: true,
    maxTokens: 32768,
  },
  'gemma-7b': {
    id: 'gemma-7b',
    name: 'Gemma 7B',
    description: 'Lightweight model from Google',
    context: '8K',
    isFree: true,
    maxTokens: 8192,
  },
  'qwen-7b': {
    id: 'qwen-7b',
    name: 'Qwen 7B',
    description: 'Model from Alibaba Cloud',
    context: '8K',
    isFree: true,
    maxTokens: 8192,
  },
  'glm-4.5': {
    id: 'glm-4.5',
    name: 'GLM-4.5',
    description: 'Model from Zhipu AI',
    context: '128K',
    isFree: false,
    maxTokens: 131072,
  },
  'kimi-k2': {
    id: 'kimi-k2',
    name: 'Kimi K2',
    description: 'Model from Moonshot AI',
    context: '128K',
    isFree: false,
    maxTokens: 131072,
  },
} as const;

export const DEFAULT_MODEL = 'gpt-3.5-turbo';

export const FREE_MODELS = Object.values(MODELS).filter(model => model.isFree);
export const PREMIUM_MODELS = Object.values(MODELS).filter(model => !model.isFree);

export function getModelInfo(modelId: string): ModelInfo {
  return MODELS[modelId] || MODELS[DEFAULT_MODEL];
}
