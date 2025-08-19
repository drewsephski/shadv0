import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function getOrCreateUser(clerkId: string) {
  try {
    // First, try to find the user by clerkId
    let user = await db.user.findUnique({
      where: { clerkId },
    });

    // If user doesn't exist, create a new one with minimal data
    // We'll update with more info when needed
    if (!user) {
      user = await db.user.create({
        data: {
          clerkId,
          email: `${clerkId}@temporary.email`, // Will be updated on first login
          name: 'New User',
        },
      });
    }

    return user;
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    return null;
  }
}

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.userId) return null;
  
  return getOrCreateUser(session.userId);
}
