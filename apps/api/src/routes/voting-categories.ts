import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { zValidator } from '@hono/zod-validator';
import { and, asc, desc, eq, inArray, isNull, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { db } from '../lib/db.js';
import {
  clubMemberships,
  events,
  votingCategories,
  votingCategoryRegistrations,
  type Event,
  type VotingCategory,
  type VotingCategoryRegistration,
} from '@csps/db';
import { requireAuth } from '../middleware/auth.js';
import {
  assignRegistrationSchema,
  CLUB_PERMISSIONS,
  createVotingCategorySchema,
  updateVotingCategorySchema,
  type ClubPermission,
  type VotingCategoryRegistrationResponse,
  type VotingCategoryResponse,
} from '@csps/shared';

const votingCategoriesRoute = new Hono<{
  Variables: { userId: string | undefined };
}>();

function toResponse(
  category: VotingCategory,
  entryCount: number,
  registrationIds?: string[],
): VotingCategoryResponse {
  return {
    id: category.id,
    eventId: category.eventId,
    name: category.name,
    description: category.description,
    maxCapacity: category.maxCapacity,
    driversOnly: category.driversOnly,
    membersOnly: category.membersOnly,
    automaticEntry: category.automaticEntry,
    featured: category.featured,
    stripePriceId: category.stripePriceId,
    entryCount,
    ...(registrationIds !== undefined ? { registrationIds } : {}),
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt ? category.updatedAt.toISOString() : null,
  };
}

function registrationToResponse(
  row: VotingCategoryRegistration,
): VotingCategoryRegistrationResponse {
  return {
    id: row.id,
    votingCategoryId: row.votingCategoryId,
    registrationId: row.registrationId,
    createdAt: row.createdAt.toISOString(),
  };
}

async function loadEventOr404(id: string): Promise<Event> {
  const [event] = await db
    .select()
    .from(events)
    .where(and(eq(events.id, id), isNull(events.deletedAt)))
    .limit(1);
  if (!event) {
    throw new HTTPException(404, { message: 'Event not found' });
  }
  return event;
}

async function loadCategoryOr404(id: string): Promise<VotingCategory> {
  const [category] = await db
    .select()
    .from(votingCategories)
    .where(eq(votingCategories.id, id))
    .limit(1);
  if (!category) {
    throw new HTTPException(404, { message: 'Voting category not found' });
  }
  return category;
}

async function requirePermissionOnClub(
  clubId: string,
  userId: string,
  permission: ClubPermission,
): Promise<void> {
  const [membership] = await db
    .select()
    .from(clubMemberships)
    .where(and(eq(clubMemberships.clubId, clubId), eq(clubMemberships.userId, userId)))
    .limit(1);
  if (!membership || !membership.permissions.includes(permission)) {
    throw new HTTPException(403, {
      message: `Missing required permission: ${permission}`,
    });
  }
}

// Throws 409 if voting has started on the given event.
function assertVotingNotStarted(event: Event): void {
  if (event.votingStart !== null) {
    throw new HTTPException(409, {
      message: 'Cannot modify voting categories after votingStart is set',
    });
  }
}

async function countEntries(categoryId: string): Promise<number> {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(votingCategoryRegistrations)
    .where(eq(votingCategoryRegistrations.votingCategoryId, categoryId));
  return row?.count ?? 0;
}

async function listRegistrationIds(categoryId: string): Promise<string[]> {
  const rows = await db
    .select({ registrationId: votingCategoryRegistrations.registrationId })
    .from(votingCategoryRegistrations)
    .where(eq(votingCategoryRegistrations.votingCategoryId, categoryId))
    .orderBy(asc(votingCategoryRegistrations.createdAt));
  return rows.map((r) => r.registrationId);
}

// POST /api/events/:eventId/voting-categories — create.
votingCategoriesRoute.post(
  '/api/events/:eventId/voting-categories',
  requireAuth,
  zValidator('json', createVotingCategorySchema),
  async (c) => {
    const eventId = c.req.param('eventId');
    const userId = c.get('userId') as string;
    const input = c.req.valid('json');

    const event = await loadEventOr404(eventId);
    await requirePermissionOnClub(
      event.clubId,
      userId,
      CLUB_PERMISSIONS.CREATE_VOTING_CATEGORY,
    );

    const [created] = await db
      .insert(votingCategories)
      .values({
        id: nanoid(),
        eventId,
        name: input.name,
        description: input.description ?? null,
        maxCapacity: input.maxCapacity ?? null,
        driversOnly: input.driversOnly ?? false,
        membersOnly: input.membersOnly ?? false,
        automaticEntry: input.automaticEntry ?? false,
        featured: input.featured ?? false,
        stripePriceId: input.stripePriceId ?? null,
      })
      .returning();

    if (!created) {
      throw new HTTPException(500, { message: 'Failed to create voting category' });
    }

    // automaticEntry: seed assignments for every existing registration of the
    // event. The registrations table doesn't exist yet (Session 11), so until
    // then this is a no-op via a raw query guarded against the missing table.
    let entryCount = 0;
    if (created.automaticEntry) {
      try {
        const regRows = await db.execute<{ id: string }>(
          sql`SELECT id FROM registrations WHERE event_id = ${eventId}`,
        );
        const rows = (regRows as unknown as { rows?: { id: string }[] }).rows
          ?? (regRows as unknown as { id: string }[]);
        const ids = Array.isArray(rows) ? rows.map((r) => r.id) : [];
        if (ids.length > 0) {
          await db.insert(votingCategoryRegistrations).values(
            ids.map((registrationId) => ({
              id: nanoid(),
              votingCategoryId: created.id,
              registrationId,
            })),
          );
          entryCount = ids.length;
        }
      } catch {
        // Registrations table not yet present — skip auto-entry seeding.
      }
    }

    return c.json({ data: toResponse(created, entryCount) }, 201);
  },
);

// GET /api/events/:eventId/voting-categories — public list.
votingCategoriesRoute.get('/api/events/:eventId/voting-categories', async (c) => {
  const eventId = c.req.param('eventId');
  await loadEventOr404(eventId);

  const categories = await db
    .select()
    .from(votingCategories)
    .where(eq(votingCategories.eventId, eventId))
    .orderBy(desc(votingCategories.featured), asc(votingCategories.createdAt));

  if (categories.length === 0) {
    return c.json({ data: [] });
  }

  const counts = await db
    .select({
      votingCategoryId: votingCategoryRegistrations.votingCategoryId,
      count: sql<number>`count(*)::int`,
    })
    .from(votingCategoryRegistrations)
    .where(
      inArray(
        votingCategoryRegistrations.votingCategoryId,
        categories.map((c2) => c2.id),
      ),
    )
    .groupBy(votingCategoryRegistrations.votingCategoryId);

  const countsById = new Map(counts.map((r) => [r.votingCategoryId, r.count]));
  return c.json({
    data: categories.map((cat) => toResponse(cat, countsById.get(cat.id) ?? 0)),
  });
});

// GET /api/voting-categories/:id — public detail, includes registrationIds.
votingCategoriesRoute.get('/api/voting-categories/:id', async (c) => {
  const id = c.req.param('id');
  const category = await loadCategoryOr404(id);
  const registrationIds = await listRegistrationIds(id);
  return c.json({ data: toResponse(category, registrationIds.length, registrationIds) });
});

// PUT /api/voting-categories/:id — update.
votingCategoriesRoute.put(
  '/api/voting-categories/:id',
  requireAuth,
  zValidator('json', updateVotingCategorySchema),
  async (c) => {
    const id = c.req.param('id');
    const userId = c.get('userId') as string;
    const updates = c.req.valid('json');

    const category = await loadCategoryOr404(id);
    const event = await loadEventOr404(category.eventId);
    await requirePermissionOnClub(
      event.clubId,
      userId,
      CLUB_PERMISSIONS.CREATE_VOTING_CATEGORY,
    );
    assertVotingNotStarted(event);

    if (updates.maxCapacity !== undefined && updates.maxCapacity !== null) {
      const entryCount = await countEntries(id);
      if (entryCount > updates.maxCapacity) {
        throw new HTTPException(400, {
          message: `Cannot reduce maxCapacity below current entry count (${entryCount})`,
        });
      }
    }

    const patch: Partial<typeof votingCategories.$inferInsert> = {
      updatedAt: new Date(),
    };
    if (updates.name !== undefined) patch.name = updates.name;
    if (updates.description !== undefined) patch.description = updates.description;
    if (updates.maxCapacity !== undefined) patch.maxCapacity = updates.maxCapacity;
    if (updates.driversOnly !== undefined) patch.driversOnly = updates.driversOnly;
    if (updates.membersOnly !== undefined) patch.membersOnly = updates.membersOnly;
    if (updates.automaticEntry !== undefined) patch.automaticEntry = updates.automaticEntry;
    if (updates.featured !== undefined) patch.featured = updates.featured;
    if (updates.stripePriceId !== undefined) patch.stripePriceId = updates.stripePriceId;

    const [updated] = await db
      .update(votingCategories)
      .set(patch)
      .where(eq(votingCategories.id, id))
      .returning();
    if (!updated) {
      throw new HTTPException(404, { message: 'Voting category not found' });
    }

    const entryCount = await countEntries(id);
    return c.json({ data: toResponse(updated, entryCount) });
  },
);

// DELETE /api/voting-categories/:id — remove category and its assignments.
votingCategoriesRoute.delete('/api/voting-categories/:id', requireAuth, async (c) => {
  const id = c.req.param('id');
  const userId = c.get('userId') as string;

  const category = await loadCategoryOr404(id);
  const event = await loadEventOr404(category.eventId);
  await requirePermissionOnClub(
    event.clubId,
    userId,
    CLUB_PERMISSIONS.CREATE_VOTING_CATEGORY,
  );
  assertVotingNotStarted(event);

  // cascade delete on FK handles assignments, but be explicit for clarity.
  await db
    .delete(votingCategoryRegistrations)
    .where(eq(votingCategoryRegistrations.votingCategoryId, id));
  await db.delete(votingCategories).where(eq(votingCategories.id, id));

  return c.body(null, 204);
});

// POST /api/voting-categories/:id/registrations — assign a car to a category.
votingCategoriesRoute.post(
  '/api/voting-categories/:id/registrations',
  requireAuth,
  zValidator('json', assignRegistrationSchema),
  async (c) => {
    const id = c.req.param('id');
    const userId = c.get('userId') as string;
    const { registrationId } = c.req.valid('json');

    const category = await loadCategoryOr404(id);
    const event = await loadEventOr404(category.eventId);
    assertVotingNotStarted(event);

    // Permission check: REGISTER_CAR on the event's club. The "driver may
    // assign own car" branch will be wired once the registrations table
    // exists (Session 11).
    await requirePermissionOnClub(event.clubId, userId, CLUB_PERMISSIONS.REGISTER_CAR);

    if (category.maxCapacity !== null) {
      const entryCount = await countEntries(id);
      if (entryCount >= category.maxCapacity) {
        throw new HTTPException(409, {
          message: 'Voting category is at capacity',
        });
      }
    }

    // Prevent duplicates (also enforced by unique index).
    const [existing] = await db
      .select()
      .from(votingCategoryRegistrations)
      .where(
        and(
          eq(votingCategoryRegistrations.votingCategoryId, id),
          eq(votingCategoryRegistrations.registrationId, registrationId),
        ),
      )
      .limit(1);
    if (existing) {
      throw new HTTPException(409, {
        message: 'Registration is already assigned to this category',
      });
    }

    const [created] = await db
      .insert(votingCategoryRegistrations)
      .values({
        id: nanoid(),
        votingCategoryId: id,
        registrationId,
      })
      .returning();
    if (!created) {
      throw new HTTPException(500, { message: 'Failed to assign registration' });
    }

    return c.json({ data: registrationToResponse(created) }, 201);
  },
);

// DELETE /api/voting-categories/:id/registrations/:regId — unassign.
votingCategoriesRoute.delete(
  '/api/voting-categories/:id/registrations/:regId',
  requireAuth,
  async (c) => {
    const id = c.req.param('id');
    const regId = c.req.param('regId');
    const userId = c.get('userId') as string;

    const category = await loadCategoryOr404(id);
    const event = await loadEventOr404(category.eventId);
    assertVotingNotStarted(event);
    await requirePermissionOnClub(event.clubId, userId, CLUB_PERMISSIONS.REGISTER_CAR);

    const [existing] = await db
      .select()
      .from(votingCategoryRegistrations)
      .where(
        and(
          eq(votingCategoryRegistrations.votingCategoryId, id),
          eq(votingCategoryRegistrations.registrationId, regId),
        ),
      )
      .limit(1);
    if (!existing) {
      throw new HTTPException(404, { message: 'Assignment not found' });
    }

    await db
      .delete(votingCategoryRegistrations)
      .where(eq(votingCategoryRegistrations.id, existing.id));

    return c.body(null, 204);
  },
);

export default votingCategoriesRoute;
