import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { zValidator } from '@hono/zod-validator';
import { and, desc, eq, ilike, isNull, or, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { db } from '../lib/db.js';
import {
  clubMemberships,
  events,
  registrations,
  users,
  votingCategories,
  votingCategoryRegistrations,
  type Event,
  type Registration,
} from '@csps/db';
import { requireAuth } from '../middleware/auth.js';
import {
  CLUB_PERMISSIONS,
  deriveDriverStatus,
  gateRegisterSchema,
  listRegistrationsQuerySchema,
  preRegisterSchema,
  updateRegistrationSchema,
  type ClubPermission,
  type RegistrationResponse,
} from '@csps/shared';
import {
  generateRegistrationCode,
  getNextCarId,
} from '../lib/registration-helpers.js';

const registrationsRoute = new Hono<{
  Variables: { userId: string | undefined };
}>();

function toResponse(reg: Registration): RegistrationResponse {
  return {
    id: reg.id,
    eventId: reg.eventId,
    userId: reg.userId,
    vehicleId: reg.vehicleId,
    registrationCode: reg.registrationCode,
    registrationDate: reg.registrationDate.toISOString(),
    carId: reg.carId,
    checkedInAt: reg.checkedInAt ? reg.checkedInAt.toISOString() : null,
    stripePaymentId: reg.stripePaymentId,
    driverStatus: deriveDriverStatus(reg),
    createdAt: reg.createdAt.toISOString(),
    updatedAt: reg.updatedAt ? reg.updatedAt.toISOString() : null,
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

async function loadRegistrationOr404(id: string): Promise<Registration> {
  const [reg] = await db
    .select()
    .from(registrations)
    .where(eq(registrations.id, id))
    .limit(1);
  if (!reg) {
    throw new HTTPException(404, { message: 'Registration not found' });
  }
  return reg;
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

async function countRegistrations(eventId: string): Promise<number> {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(registrations)
    .where(eq(registrations.eventId, eventId));
  return row?.count ?? 0;
}

async function assertCapacity(event: Event): Promise<void> {
  if (event.maxCapacity !== null) {
    const count = await countRegistrations(event.id);
    if (count >= event.maxCapacity) {
      throw new HTTPException(409, { message: 'Event is at capacity' });
    }
  }
}

async function autoAssignCategories(
  eventId: string,
  registrationId: string,
): Promise<void> {
  const autoCategories = await db
    .select({ id: votingCategories.id })
    .from(votingCategories)
    .where(
      and(
        eq(votingCategories.eventId, eventId),
        eq(votingCategories.automaticEntry, true),
      ),
    );

  if (autoCategories.length > 0) {
    await db.insert(votingCategoryRegistrations).values(
      autoCategories.map((cat) => ({
        id: nanoid(),
        votingCategoryId: cat.id,
        registrationId,
      })),
    );
  }
}

// POST /api/events/:eventId/registrations — pre-register (auth required).
registrationsRoute.post(
  '/api/events/:eventId/registrations',
  requireAuth,
  zValidator('json', preRegisterSchema),
  async (c) => {
    const eventId = c.req.param('eventId');
    const userId = c.get('userId') as string;
    const input = c.req.valid('json');

    const event = await loadEventOr404(eventId);

    if (!event.preRegistration) {
      throw new HTTPException(400, {
        message: 'Pre-registration is not enabled for this event',
      });
    }

    await assertCapacity(event);

    // Check for duplicate registration.
    const [existing] = await db
      .select({ id: registrations.id })
      .from(registrations)
      .where(
        and(eq(registrations.eventId, eventId), eq(registrations.userId, userId)),
      )
      .limit(1);
    if (existing) {
      throw new HTTPException(409, {
        message: 'Already registered for this event',
      });
    }

    const registrationCode = await generateRegistrationCode(db);

    const [created] = await db
      .insert(registrations)
      .values({
        id: nanoid(),
        eventId,
        userId,
        vehicleId: input.vehicleId ?? null,
        registrationCode,
        registrationDate: new Date(),
      })
      .returning();

    if (!created) {
      throw new HTTPException(500, { message: 'Failed to create registration' });
    }

    await autoAssignCategories(eventId, created.id);

    // If event requires payment and is not unpaid pre-reg, indicate checkout needed.
    const needsPayment =
      !event.preRegistrationUnpaid && event.preRegistrationStripePriceId;

    return c.json(
      {
        data: toResponse(created),
        ...(needsPayment
          ? { stripeCheckoutRequired: true, stripePriceId: event.preRegistrationStripePriceId }
          : {}),
      },
      201,
    );
  },
);

// POST /api/events/:eventId/registrations/gate — gate registration (requires BYPASS_REGISTRATION).
registrationsRoute.post(
  '/api/events/:eventId/registrations/gate',
  requireAuth,
  zValidator('json', gateRegisterSchema),
  async (c) => {
    const eventId = c.req.param('eventId');
    const userId = c.get('userId') as string;
    const input = c.req.valid('json');

    const event = await loadEventOr404(eventId);
    await requirePermissionOnClub(
      event.clubId,
      userId,
      CLUB_PERMISSIONS.BYPASS_REGISTRATION,
    );

    await assertCapacity(event);

    // Look up user by email if provided.
    let driverUserId: string | null = null;
    if (input.driverEmail) {
      const [user] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.emailAddress, input.driverEmail))
        .limit(1);
      if (user) {
        driverUserId = user.id;
      }
    }

    const registrationCode = await generateRegistrationCode(db);

    const [created] = await db
      .insert(registrations)
      .values({
        id: nanoid(),
        eventId,
        userId: driverUserId,
        vehicleId: input.vehicleId ?? null,
        registrationCode,
        registrationDate: new Date(),
      })
      .returning();

    if (!created) {
      throw new HTTPException(500, { message: 'Failed to create registration' });
    }

    await autoAssignCategories(eventId, created.id);

    return c.json({ data: toResponse(created) }, 201);
  },
);

// GET /api/events/:eventId/registrations — list registrations for event (requires MANAGE_EVENT permission via BYPASS_REGISTRATION).
registrationsRoute.get(
  '/api/events/:eventId/registrations',
  requireAuth,
  zValidator('query', listRegistrationsQuerySchema),
  async (c) => {
    const eventId = c.req.param('eventId');
    const userId = c.get('userId') as string;
    const { search, limit, offset } = c.req.valid('query');

    const event = await loadEventOr404(eventId);
    await requirePermissionOnClub(
      event.clubId,
      userId,
      CLUB_PERMISSIONS.BYPASS_REGISTRATION,
    );

    const filters = [eq(registrations.eventId, eventId)];

    if (search) {
      const pattern = `%${search}%`;
      filters.push(
        or(
          ilike(registrations.registrationCode, pattern),
          sql`${registrations.carId}::text ILIKE ${pattern}`,
          // Join-based user name/email search via subquery.
          sql`${registrations.userId} IN (
            SELECT ${users.id} FROM ${users}
            WHERE ${users.firstName} ILIKE ${pattern}
              OR ${users.lastName} ILIKE ${pattern}
              OR ${users.emailAddress} ILIKE ${pattern}
          )`,
        )!,
      );
    }

    const [totalRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(registrations)
      .where(and(...filters));

    const rows = await db
      .select()
      .from(registrations)
      .where(and(...filters))
      .orderBy(desc(registrations.createdAt))
      .limit(limit)
      .offset(offset);

    return c.json({
      data: rows.map(toResponse),
      total: totalRow?.count ?? 0,
      limit,
      offset,
    });
  },
);

// GET /api/registrations/:id — registration detail (owner or event manager).
registrationsRoute.get('/api/registrations/:id', requireAuth, async (c) => {
  const id = c.req.param('id');
  const userId = c.get('userId') as string;

  const reg = await loadRegistrationOr404(id);

  // Owner can view their own registration; otherwise need permission.
  if (reg.userId !== userId) {
    const event = await loadEventOr404(reg.eventId);
    await requirePermissionOnClub(
      event.clubId,
      userId,
      CLUB_PERMISSIONS.BYPASS_REGISTRATION,
    );
  }

  return c.json({ data: toResponse(reg) });
});

// PUT /api/registrations/:id — update registration (owner or event manager).
registrationsRoute.put(
  '/api/registrations/:id',
  requireAuth,
  zValidator('json', updateRegistrationSchema),
  async (c) => {
    const id = c.req.param('id');
    const userId = c.get('userId') as string;
    const updates = c.req.valid('json');

    const reg = await loadRegistrationOr404(id);
    const event = await loadEventOr404(reg.eventId);

    // Owner can update their own; otherwise need permission.
    if (reg.userId !== userId) {
      await requirePermissionOnClub(
        event.clubId,
        userId,
        CLUB_PERMISSIONS.BYPASS_REGISTRATION,
      );
    }

    // vehicleId cannot be changed after voting has started.
    if (updates.vehicleId !== undefined && event.votingStart !== null) {
      throw new HTTPException(409, {
        message: 'Cannot change vehicleId after voting has started',
      });
    }

    const patch: Partial<typeof registrations.$inferInsert> = {
      updatedAt: new Date(),
    };
    if (updates.vehicleId !== undefined) patch.vehicleId = updates.vehicleId;

    const [updated] = await db
      .update(registrations)
      .set(patch)
      .where(eq(registrations.id, id))
      .returning();
    if (!updated) {
      throw new HTTPException(404, { message: 'Registration not found' });
    }

    return c.json({ data: toResponse(updated) });
  },
);

// PUT /api/registrations/:id/check-in — check in a registration (requires BYPASS_REGISTRATION).
registrationsRoute.put('/api/registrations/:id/check-in', requireAuth, async (c) => {
  const id = c.req.param('id');
  const userId = c.get('userId') as string;

  const reg = await loadRegistrationOr404(id);
  const event = await loadEventOr404(reg.eventId);

  await requirePermissionOnClub(
    event.clubId,
    userId,
    CLUB_PERMISSIONS.BYPASS_REGISTRATION,
  );

  if (reg.carId !== null) {
    throw new HTTPException(409, { message: 'Registration is already checked in' });
  }

  // Use transaction with row-level locking for carId assignment.
  const nextCarId = await getNextCarId(event.id, db);

  const [updated] = await db
    .update(registrations)
    .set({
      carId: nextCarId,
      checkedInAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(registrations.id, id))
    .returning();

  if (!updated) {
    throw new HTTPException(500, { message: 'Failed to check in registration' });
  }

  return c.json({ data: toResponse(updated) });
});

// GET /api/registrations/by-code/:code — lookup by registration code (requires BYPASS_REGISTRATION).
registrationsRoute.get(
  '/api/registrations/by-code/:code',
  requireAuth,
  async (c) => {
    const code = c.req.param('code').toUpperCase();
    const userId = c.get('userId') as string;

    const [reg] = await db
      .select()
      .from(registrations)
      .where(eq(registrations.registrationCode, code))
      .limit(1);

    if (!reg) {
      throw new HTTPException(404, { message: 'Registration not found' });
    }

    const event = await loadEventOr404(reg.eventId);
    await requirePermissionOnClub(
      event.clubId,
      userId,
      CLUB_PERMISSIONS.BYPASS_REGISTRATION,
    );

    return c.json({ data: toResponse(reg) });
  },
);

// GET /api/users/me/registrations — list own registrations across events (auth required).
registrationsRoute.get('/api/users/me/registrations', requireAuth, async (c) => {
  const userId = c.get('userId') as string;

  const rows = await db
    .select()
    .from(registrations)
    .where(eq(registrations.userId, userId))
    .orderBy(desc(registrations.registrationDate));

  return c.json({ data: rows.map(toResponse) });
});

export default registrationsRoute;
