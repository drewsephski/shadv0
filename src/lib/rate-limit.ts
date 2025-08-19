import { env } from './validations/env';
import { logger } from './utils/logger';

// Simple in-memory rate limiter for development
class InMemoryRateLimiter {
  private limits = new Map<string, { count: number; resetAt: number }>();
  
  async limit(key: string, limit: number, windowMs: number) {
    const now = Date.now();
    const resetAt = now + windowMs;
    
    const existing = this.limits.get(key);
    
    if (existing && existing.resetAt > now) {
      // Existing limit, check if exceeded
      if (existing.count >= limit) {
        return {
          success: false,
          limit,
          remaining: 0,
          reset: Math.ceil((existing.resetAt - now) / 1000),
        };
      }
      
      // Increment count
      const updated = { ...existing, count: existing.count + 1 };
      this.limits.set(key, updated);
      
      return {
        success: true,
        limit,
        remaining: Math.max(0, limit - updated.count),
        reset: Math.ceil((updated.resetAt - now) / 1000),
      };
    }
    
    // New or expired limit
    this.limits.set(key, { count: 1, resetAt });
    
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: Math.ceil(windowMs / 1000),
    };
  }
}

// Rate limiter interface
interface RateLimiter {
  limit: (key: string) => Promise<{
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
  }>;
}

// Initialize rate limiters based on environment
let rateLimitConfig: {
  anonymous: RateLimiter;
  authenticated: RateLimiter;
};

if (process.env.NODE_ENV === 'production' && env.UPSTASH_REDIS_REST_URL) {
  // In production, use Upstash Redis for rate limiting
  const { Ratelimit } = await import('@upstash/ratelimit');
  const { Redis } = await import('@upstash/redis');
  
  // Initialize Redis client
  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL || '',
    token: env.UPSTASH_REDIS_REST_TOKEN || '',
  });
  
  rateLimitConfig = {
    anonymous: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '10 s'),
      analytics: true,
      prefix: 'ratelimit:anonymous',
    }),
    authenticated: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '60 s'),
      analytics: true,
      prefix: 'ratelimit:auth',
    }),
  };
} else {
  // In development, use in-memory rate limiting
  const anonymousLimiter = new InMemoryRateLimiter();
  const authenticatedLimiter = new InMemoryRateLimiter();
  
  rateLimitConfig = {
    anonymous: {
      limit: (key: string) => anonymousLimiter.limit(key, 100, 10000), // 100 req/10s in dev
    },
    authenticated: {
      limit: (key: string) => authenticatedLimiter.limit(key, 1000, 60000), // 1000 req/min in dev
    },
  };
}

type RateLimitType = keyof typeof rateLimitConfig;

export async function checkRateLimit(
  identifier: string,
  type: RateLimitType = 'anonymous'
) {
  try {
    const rateLimit = rateLimitConfig[type];
    const { success, limit, reset, remaining } = await rateLimit.limit(identifier);

    logger.debug('Rate limit check', {
      identifier,
      type,
      success,
      limit,
      remaining,
      reset,
    });

    if (!success) {
      logger.warn('Rate limit exceeded', {
        identifier,
        type,
        limit,
        remaining,
        reset,
      });
    }

    return {
      success,
      limit,
      remaining,
      reset: new Date(reset).getTime() - Date.now(),
    };
  } catch (error) {
    // If Redis is down, we'll allow the request but log the error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    // Log the full error message with context
    logger.error(`Rate limit check failed for ${type} ${identifier}: ${errorMessage}`);
    return { success: true, limit: 0, remaining: 0, reset: 0 };
  }
}
