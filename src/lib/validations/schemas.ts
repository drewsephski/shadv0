import { z } from 'zod';

export const messageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1, 'Message content is required'),
});

export const chatRequestSchema = z.object({
  model: z.string().min(1, 'Model identifier is required'),
  messages: z.array(messageSchema).min(1, 'At least one message is required'),
});

export const envSchema = z.object({
  // API Keys
  OPENROUTER_API_KEY: z.string().min(1, 'OpenRouter API key is required'),
  
  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // URLs
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  
  // Rate Limiting - Make these optional for development
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  
  // Rate limiting configuration
  RATE_LIMIT_WINDOW_MS: z.string().default('60000'), // 1 minute in ms
  RATE_LIMIT_MAX_REQUESTS_ANONYMOUS: z.string().default('10'),
  RATE_LIMIT_MAX_REQUESTS_AUTHENTICATED: z.string().default('100'),
});
