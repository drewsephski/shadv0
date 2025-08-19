import { PrismaClient } from '@prisma/client';

declare global {
  // Using var for global type augmentation
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create a new PrismaClient instance if it doesn't exist
const prismaClient = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// In development, set the global instance to enable hot-reloading
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prismaClient;
}

export const db = prismaClient;

// Helper function to get or create a user with proper error handling
interface UserData {
  clerkId: string;
  email: string;
  name?: string | null;
}

export async function getOrCreateUser(userData: UserData) {
  try {
    // First try to find the user
    let user = await db.user.findUnique({
      where: { clerkId: userData.clerkId },
    });

    // If user doesn't exist, create a new one
    if (!user) {
      user = await db.user.create({
        data: {
          clerkId: userData.clerkId,
          email: userData.email,
          name: userData.name || null,
        },
      });
    }

    return user;
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    throw new Error('Failed to get or create user');
  }
}
