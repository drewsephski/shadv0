import { z } from 'zod';
import { envSchema } from './schemas';

type EnvSchema = z.infer<typeof envSchema>;

// Extend NodeJS.ProcessEnv with our schema
declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ProcessEnv extends EnvSchema {}
}

// This export is used by the logger
export const env = envSchema.parse(process.env);

export function validateEnv(): z.ZodError['errors'] | null {
  try {
    envSchema.parse(process.env);
    return null; // Validation successful
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables detected:', error.errors);
      return error.errors; // Return the Zod errors
    }
    
    console.error('❌ Failed to validate environment variables with unknown error:', error);
    throw error;
  }
}

// The direct call to validateEnv() at import time is removed.
// It will now be explicitly called in API routes.
