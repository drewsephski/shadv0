import { auth } from '@clerk/nextjs/server';

export async function getOrCreateUser(clerkId: string) {
  // Clerk manages users, so we just return a minimal user object
  return {
    id: clerkId,
    clerkId,
    email: `${clerkId}@temporary.email`,
    name: 'User'
  };
}

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.userId) return null;
  
  return getOrCreateUser(session.userId);
}
