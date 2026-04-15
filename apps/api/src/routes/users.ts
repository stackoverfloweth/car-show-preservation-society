import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { zValidator } from '@hono/zod-validator';
import { eq, ilike, or } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../lib/db.js';
import { users, type User } from '@csps/db';
import { requireAuth } from '../middleware/auth.js';
import { updateUserSchema, type UserResponse } from '@csps/shared';

const usersRoute = new Hono<{ Variables: { userId: string } }>();

function toResponse(user: User, opts: { isSelf: boolean }): UserResponse {
  const hideEmail = user.hideEmail && !opts.isSelf;
  const hidePhone = user.hidePhone && !opts.isSelf;
  const hideLocation = user.hideLocation && !opts.isSelf;

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: hideEmail ? null : user.emailAddress,
    phoneNumber: hidePhone ? null : user.phoneNumber,
    location: hideLocation ? null : user.location ?? null,
    profileImage: user.profileImage,
    hideEmail: user.hideEmail,
    hidePhone: user.hidePhone,
    hideLocation: user.hideLocation,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt ? user.updatedAt.toISOString() : null,
  };
}

// GET /api/users/search?q=... — must come before /:id to avoid shadowing
usersRoute.get(
  '/api/users/search',
  requireAuth,
  zValidator(
    'query',
    z.object({
      q: z.string().min(1).max(100),
      limit: z.coerce.number().int().min(1).max(50).default(20),
    }),
  ),
  async (c) => {
    const { q, limit } = c.req.valid('query');
    const viewerId = c.get('userId');
    const pattern = `%${q}%`;

    const results = await db
      .select()
      .from(users)
      .where(or(ilike(users.firstName, pattern), ilike(users.lastName, pattern), ilike(users.emailAddress, pattern)))
      .limit(limit);

    return c.json({
      data: results.map((u) => toResponse(u, { isSelf: u.id === viewerId })),
    });
  },
);

// PUT /api/users/me
usersRoute.put('/api/users/me', requireAuth, zValidator('json', updateUserSchema), async (c) => {
  const userId = c.get('userId');
  const updates = c.req.valid('json');

  const [updated] = await db
    .update(users)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();

  if (!updated) {
    throw new HTTPException(404, { message: 'User not found' });
  }

  return c.json({ data: toResponse(updated, { isSelf: true }) });
});

// GET /api/users/:id
usersRoute.get('/api/users/:id', async (c) => {
  const id = c.req.param('id');

  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);

  if (!user) {
    throw new HTTPException(404, { message: 'User not found' });
  }

  return c.json({ data: toResponse(user, { isSelf: false }) });
});

export default usersRoute;
