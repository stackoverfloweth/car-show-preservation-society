import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';

export type AuthVariables = {
  userId: string | undefined;
};

/**
 * Verifies the Clerk JWT from the Authorization header.
 * Injects `userId` into context. Throws 401 if the token is missing or invalid.
 */
export const requireAuth = createMiddleware<{ Variables: { userId: string } }>(
  async (c, next) => {
    await clerkMiddleware()(c, async () => {});

    const auth = getAuth(c);

    if (!auth?.userId) {
      throw new HTTPException(401, { message: 'Unauthorized' });
    }

    c.set('userId', auth.userId);
    await next();
  },
);

/**
 * Attempts to verify the Clerk JWT but never throws.
 * Sets `userId` in context when valid, leaves it undefined otherwise.
 */
export const optionalAuth = createMiddleware<{ Variables: AuthVariables }>(
  async (c, next) => {
    await clerkMiddleware()(c, async () => {});

    const auth = getAuth(c);
    c.set('userId', auth?.userId ?? undefined);
    await next();
  },
);
