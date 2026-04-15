import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { zValidator } from '@hono/zod-validator';
import { and, count, desc, eq, ilike, isNull, or } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { db } from '../lib/db.js';
import { clubs, type Club } from '@csps/db';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import {
  createClubSchema,
  updateClubSchema,
  listClubsQuerySchema,
  type ClubResponse,
} from '@csps/shared';
import { buildPaginatedResult, paginationToSql } from '../lib/pagination.js';

const clubsRoute = new Hono<{ Variables: { userId: string | undefined } }>();

function toResponse(club: Club): ClubResponse {
  return {
    id: club.id,
    name: club.name,
    description: club.description,
    clubLogo: club.clubLogo,
    contactUserId: club.contactUserId,
    joinable: club.joinable,
    visible: club.visible,
    createdAt: club.createdAt.toISOString(),
    updatedAt: club.updatedAt ? club.updatedAt.toISOString() : null,
  };
}

// POST /api/clubs — authenticated creator becomes the contact user.
clubsRoute.post('/api/clubs', requireAuth, zValidator('json', createClubSchema), async (c) => {
  const userId = c.get('userId') as string;
  const input = c.req.valid('json');

  const [created] = await db
    .insert(clubs)
    .values({
      id: nanoid(),
      name: input.name,
      description: input.description ?? '',
      clubLogo: input.clubLogo ?? null,
      contactUserId: userId,
      joinable: input.joinable ?? true,
      visible: input.visible ?? true,
    })
    .returning();

  if (!created) {
    throw new HTTPException(500, { message: 'Failed to create club' });
  }

  return c.json({ data: toResponse(created) }, 201);
});

// GET /api/clubs — public listing of visible, non-deleted clubs.
clubsRoute.get('/api/clubs', zValidator('query', listClubsQuerySchema), async (c) => {
  const { q, page, pageSize } = c.req.valid('query');
  const { limit, offset } = paginationToSql({ page, pageSize });

  const searchFilter = q
    ? or(ilike(clubs.name, `%${q}%`), ilike(clubs.description, `%${q}%`))
    : undefined;

  const where = and(eq(clubs.visible, true), isNull(clubs.deletedAt), searchFilter);

  const [items, totals] = await Promise.all([
    db.select().from(clubs).where(where).orderBy(desc(clubs.createdAt)).limit(limit).offset(offset),
    db.select({ total: count() }).from(clubs).where(where),
  ]);

  const total = Number(totals[0]?.total ?? 0);

  return c.json({
    data: buildPaginatedResult(items.map(toResponse), total, { page, pageSize }),
  });
});

// GET /api/clubs/:id — public if visible; otherwise only the contact user.
// (Full member-based visibility lands with session 07's permission middleware.)
clubsRoute.get('/api/clubs/:id', optionalAuth, async (c) => {
  const id = c.req.param('id');
  const viewerId = c.get('userId');

  const [club] = await db
    .select()
    .from(clubs)
    .where(and(eq(clubs.id, id), isNull(clubs.deletedAt)))
    .limit(1);

  if (!club) {
    throw new HTTPException(404, { message: 'Club not found' });
  }

  if (!club.visible && club.contactUserId !== viewerId) {
    throw new HTTPException(404, { message: 'Club not found' });
  }

  return c.json({ data: toResponse(club) });
});

// PUT /api/clubs/:id — contact user only until session 07 adds role checks.
clubsRoute.put(
  '/api/clubs/:id',
  requireAuth,
  zValidator('json', updateClubSchema),
  async (c) => {
    const id = c.req.param('id');
    const userId = c.get('userId') as string;
    const updates = c.req.valid('json');

    const [existing] = await db
      .select()
      .from(clubs)
      .where(and(eq(clubs.id, id), isNull(clubs.deletedAt)))
      .limit(1);

    if (!existing) {
      throw new HTTPException(404, { message: 'Club not found' });
    }

    if (existing.contactUserId !== userId) {
      throw new HTTPException(403, { message: 'Forbidden' });
    }

    const [updated] = await db
      .update(clubs)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(clubs.id, id))
      .returning();

    if (!updated) {
      throw new HTTPException(404, { message: 'Club not found' });
    }

    return c.json({ data: toResponse(updated) });
  },
);

// DELETE /api/clubs/:id — soft delete by setting deletedAt.
clubsRoute.delete('/api/clubs/:id', requireAuth, async (c) => {
  const id = c.req.param('id');
  const userId = c.get('userId') as string;

  const [existing] = await db
    .select()
    .from(clubs)
    .where(and(eq(clubs.id, id), isNull(clubs.deletedAt)))
    .limit(1);

  if (!existing) {
    throw new HTTPException(404, { message: 'Club not found' });
  }

  if (existing.contactUserId !== userId) {
    throw new HTTPException(403, { message: 'Forbidden' });
  }

  await db
    .update(clubs)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(clubs.id, id));

  return c.body(null, 204);
});

export default clubsRoute;
