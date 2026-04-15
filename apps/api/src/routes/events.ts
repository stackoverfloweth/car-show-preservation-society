import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { zValidator } from '@hono/zod-validator';
import { and, asc, desc, eq, gte, isNull, lte, sql } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { db } from '../lib/db.js';
import {
  clubMemberships,
  clubs,
  eventImages,
  events,
  type Event,
  type EventImage,
  type EventLocation,
} from '@csps/db';
import { requireAuth } from '../middleware/auth.js';
import {
  addEventImageSchema,
  CLUB_PERMISSIONS,
  createEventSchema,
  deriveEventStatus,
  EVENT_STATUS,
  listEventsQuerySchema,
  updateEventSchema,
  type ClubPermission,
  type EventImageResponse,
  type EventResponse,
} from '@csps/shared';

const eventsRoute = new Hono<{ Variables: { userId: string | undefined } }>();

function imageToResponse(img: EventImage): EventImageResponse {
  return {
    id: img.id,
    eventId: img.eventId,
    source: img.source,
    createdAt: img.createdAt.toISOString(),
  };
}

function toResponse(
  event: Event,
  images: EventImage[],
  extras: { distanceKm?: number } = {},
): EventResponse {
  const status = deriveEventStatus({
    startDate: event.startDate,
    endDate: event.endDate,
    votingStart: event.votingStart,
    votingEnd: event.votingEnd,
  });
  return {
    id: event.id,
    clubId: event.clubId,
    contactUserId: event.contactUserId,
    name: event.name,
    location: (event.location as EventLocation | null) ?? null,
    startDate: event.startDate ? event.startDate.toISOString() : null,
    endDate: event.endDate ? event.endDate.toISOString() : null,
    votingStart: event.votingStart ? event.votingStart.toISOString() : null,
    votingEnd: event.votingEnd ? event.votingEnd.toISOString() : null,
    ballotCount: event.ballotCount,
    canVoteForSelf: event.canVoteForSelf,
    driverSelfCategorization: event.driverSelfCategorization,
    maxSelfCategorization: event.maxSelfCategorization,
    maxCapacity: event.maxCapacity,
    preRegistration: event.preRegistration,
    preRegistrationUnpaid: event.preRegistrationUnpaid,
    stripePriceId: event.stripePriceId,
    preRegistrationStripePriceId: event.preRegistrationStripePriceId,
    stripeCrossProductIds: event.stripeCrossProductIds,
    status,
    images: images.map(imageToResponse),
    ...(extras.distanceKm !== undefined ? { distanceKm: extras.distanceKm } : {}),
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt ? event.updatedAt.toISOString() : null,
  };
}

async function loadImages(eventId: string): Promise<EventImage[]> {
  return db
    .select()
    .from(eventImages)
    .where(and(eq(eventImages.eventId, eventId), isNull(eventImages.deletedAt)))
    .orderBy(asc(eventImages.createdAt));
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
    throw new HTTPException(403, { message: `Missing required permission: ${permission}` });
  }
}

// Haversine distance in km between two lat/lng points.
function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function toDateOrNull(value: string | null | undefined): Date | null {
  return value ? new Date(value) : null;
}

// POST /api/clubs/:clubId/events — create event (requires CREATE_EVENTS).
eventsRoute.post(
  '/api/clubs/:clubId/events',
  requireAuth,
  zValidator('json', createEventSchema),
  async (c) => {
    const clubId = c.req.param('clubId');
    const userId = c.get('userId') as string;
    const input = c.req.valid('json');

    const [club] = await db
      .select()
      .from(clubs)
      .where(and(eq(clubs.id, clubId), isNull(clubs.deletedAt)))
      .limit(1);
    if (!club) {
      throw new HTTPException(404, { message: 'Club not found' });
    }

    await requirePermissionOnClub(clubId, userId, CLUB_PERMISSIONS.CREATE_EVENTS);

    const [created] = await db
      .insert(events)
      .values({
        id: nanoid(),
        clubId,
        contactUserId: input.contactUserId ?? userId,
        name: input.name,
        location: input.location ?? null,
        startDate: toDateOrNull(input.startDate ?? null),
        endDate: toDateOrNull(input.endDate ?? null),
        votingStart: toDateOrNull(input.votingStart ?? null),
        votingEnd: toDateOrNull(input.votingEnd ?? null),
        ballotCount: input.ballotCount ?? 1,
        canVoteForSelf: input.canVoteForSelf ?? false,
        driverSelfCategorization: input.driverSelfCategorization ?? false,
        maxSelfCategorization: input.maxSelfCategorization ?? null,
        maxCapacity: input.maxCapacity ?? null,
        preRegistration: input.preRegistration ?? true,
        preRegistrationUnpaid: input.preRegistrationUnpaid ?? false,
        stripePriceId: input.stripePriceId ?? null,
        preRegistrationStripePriceId: input.preRegistrationStripePriceId ?? null,
        stripeCrossProductIds: input.stripeCrossProductIds ?? [],
      })
      .returning();

    if (!created) {
      throw new HTTPException(500, { message: 'Failed to create event' });
    }

    return c.json({ data: toResponse(created, []) }, 201);
  },
);

// GET /api/events — public listing with filters.
eventsRoute.get('/api/events', zValidator('query', listEventsQuerySchema), async (c) => {
  const { status, clubId, startDateFrom, startDateTo, lat, lng, radiusKm } =
    c.req.valid('query');

  const filters = [isNull(events.deletedAt)];
  if (clubId) filters.push(eq(events.clubId, clubId));
  if (startDateFrom) filters.push(gte(events.startDate, new Date(startDateFrom)));
  if (startDateTo) filters.push(lte(events.startDate, new Date(startDateTo)));

  const rows = await db
    .select()
    .from(events)
    .where(and(...filters))
    .orderBy(asc(events.startDate));

  const images = await Promise.all(rows.map((e) => loadImages(e.id)));
  let responses: EventResponse[] = rows.map((e, i) => toResponse(e, images[i] ?? []));

  if (status) {
    responses = responses.filter((r) => r.status === status);
  }

  if (lat !== undefined && lng !== undefined && radiusKm !== undefined) {
    const origin = { lat, lng };
    responses = responses
      .filter((r) => r.location !== null)
      .map((r) => ({
        ...r,
        distanceKm: haversineKm(origin, r.location as { lat: number; lng: number }),
      }))
      .filter((r) => (r.distanceKm ?? Infinity) <= radiusKm)
      .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
  }

  return c.json({ data: responses });
});

// GET /api/events/:id — public detail.
eventsRoute.get('/api/events/:id', async (c) => {
  const id = c.req.param('id');
  const event = await loadEventOr404(id);
  const images = await loadImages(event.id);
  return c.json({ data: toResponse(event, images) });
});

// PUT /api/events/:id — requires CREATE_EVENTS on event's club.
eventsRoute.put(
  '/api/events/:id',
  requireAuth,
  zValidator('json', updateEventSchema),
  async (c) => {
    const id = c.req.param('id');
    const userId = c.get('userId') as string;
    const updates = c.req.valid('json');

    const existing = await loadEventOr404(id);
    await requirePermissionOnClub(existing.clubId, userId, CLUB_PERMISSIONS.CREATE_EVENTS);

    const now = new Date();
    const votingHasStarted =
      existing.votingStart !== null && existing.votingStart.getTime() <= now.getTime();

    if (
      votingHasStarted &&
      (updates.startDate !== undefined || updates.endDate !== undefined)
    ) {
      throw new HTTPException(400, {
        message: 'Cannot change startDate/endDate after voting has started',
      });
    }

    // Build patch, translating date strings to Date objects.
    const patch: Partial<typeof events.$inferInsert> = { updatedAt: new Date() };
    if (updates.name !== undefined) patch.name = updates.name;
    if (updates.contactUserId !== undefined) patch.contactUserId = updates.contactUserId;
    if (updates.location !== undefined) patch.location = updates.location;
    if (updates.startDate !== undefined) patch.startDate = toDateOrNull(updates.startDate);
    if (updates.endDate !== undefined) patch.endDate = toDateOrNull(updates.endDate);
    if (updates.votingStart !== undefined)
      patch.votingStart = toDateOrNull(updates.votingStart);
    if (updates.votingEnd !== undefined) patch.votingEnd = toDateOrNull(updates.votingEnd);
    if (updates.ballotCount !== undefined) patch.ballotCount = updates.ballotCount;
    if (updates.canVoteForSelf !== undefined) patch.canVoteForSelf = updates.canVoteForSelf;
    if (updates.driverSelfCategorization !== undefined)
      patch.driverSelfCategorization = updates.driverSelfCategorization;
    if (updates.maxSelfCategorization !== undefined)
      patch.maxSelfCategorization = updates.maxSelfCategorization;
    if (updates.maxCapacity !== undefined) patch.maxCapacity = updates.maxCapacity;
    if (updates.preRegistration !== undefined) patch.preRegistration = updates.preRegistration;
    if (updates.preRegistrationUnpaid !== undefined)
      patch.preRegistrationUnpaid = updates.preRegistrationUnpaid;
    if (updates.stripePriceId !== undefined) patch.stripePriceId = updates.stripePriceId;
    if (updates.preRegistrationStripePriceId !== undefined)
      patch.preRegistrationStripePriceId = updates.preRegistrationStripePriceId;
    if (updates.stripeCrossProductIds !== undefined)
      patch.stripeCrossProductIds = updates.stripeCrossProductIds;

    const [updated] = await db.update(events).set(patch).where(eq(events.id, id)).returning();
    if (!updated) {
      throw new HTTPException(404, { message: 'Event not found' });
    }

    const images = await loadImages(updated.id);
    return c.json({ data: toResponse(updated, images) });
  },
);

// DELETE /api/events/:id — soft delete.
eventsRoute.delete('/api/events/:id', requireAuth, async (c) => {
  const id = c.req.param('id');
  const userId = c.get('userId') as string;

  const existing = await loadEventOr404(id);
  await requirePermissionOnClub(existing.clubId, userId, CLUB_PERMISSIONS.CREATE_EVENTS);

  await db
    .update(events)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(events.id, id));

  return c.body(null, 204);
});

// POST /api/events/:id/images — add image.
eventsRoute.post(
  '/api/events/:id/images',
  requireAuth,
  zValidator('json', addEventImageSchema),
  async (c) => {
    const id = c.req.param('id');
    const userId = c.get('userId') as string;
    const input = c.req.valid('json');

    const existing = await loadEventOr404(id);
    await requirePermissionOnClub(existing.clubId, userId, CLUB_PERMISSIONS.CREATE_EVENTS);

    const [created] = await db
      .insert(eventImages)
      .values({ id: nanoid(), eventId: id, source: input.source })
      .returning();
    if (!created) {
      throw new HTTPException(500, { message: 'Failed to add image' });
    }

    return c.json({ data: imageToResponse(created) }, 201);
  },
);

// DELETE /api/events/:id/images/:imageId — soft delete image.
eventsRoute.delete('/api/events/:id/images/:imageId', requireAuth, async (c) => {
  const id = c.req.param('id');
  const imageId = c.req.param('imageId');
  const userId = c.get('userId') as string;

  const existing = await loadEventOr404(id);
  await requirePermissionOnClub(existing.clubId, userId, CLUB_PERMISSIONS.CREATE_EVENTS);

  const [image] = await db
    .select()
    .from(eventImages)
    .where(
      and(
        eq(eventImages.id, imageId),
        eq(eventImages.eventId, id),
        isNull(eventImages.deletedAt),
      ),
    )
    .limit(1);
  if (!image) {
    throw new HTTPException(404, { message: 'Image not found' });
  }

  await db
    .update(eventImages)
    .set({ deletedAt: new Date() })
    .where(eq(eventImages.id, imageId));

  return c.body(null, 204);
});

// PUT /api/events/:id/voting/start — manually start voting.
eventsRoute.put('/api/events/:id/voting/start', requireAuth, async (c) => {
  const id = c.req.param('id');
  const userId = c.get('userId') as string;

  const existing = await loadEventOr404(id);
  await requirePermissionOnClub(existing.clubId, userId, CLUB_PERMISSIONS.START_VOTING);

  const now = new Date();
  if (existing.votingEnd && existing.votingEnd.getTime() < now.getTime()) {
    throw new HTTPException(400, { message: 'Voting window has already ended' });
  }

  // If votingStart was a future date, clear it; otherwise set to now if unset.
  const alreadyStarted =
    existing.votingStart !== null && existing.votingStart.getTime() <= now.getTime();

  let nextVotingStart: Date | null;
  if (alreadyStarted) {
    nextVotingStart = existing.votingStart;
  } else if (existing.votingStart && existing.votingStart.getTime() > now.getTime()) {
    nextVotingStart = now;
  } else {
    nextVotingStart = now;
  }

  const [updated] = await db
    .update(events)
    .set({ votingStart: nextVotingStart, updatedAt: now })
    .where(eq(events.id, id))
    .returning();
  if (!updated) {
    throw new HTTPException(404, { message: 'Event not found' });
  }

  const images = await loadImages(updated.id);
  return c.json({ data: toResponse(updated, images) });
});

// PUT /api/events/:id/voting/end — manually end voting.
eventsRoute.put('/api/events/:id/voting/end', requireAuth, async (c) => {
  const id = c.req.param('id');
  const userId = c.get('userId') as string;

  const existing = await loadEventOr404(id);
  await requirePermissionOnClub(existing.clubId, userId, CLUB_PERMISSIONS.END_VOTING);

  const now = new Date();
  const [updated] = await db
    .update(events)
    .set({ votingEnd: now, updatedAt: now })
    .where(eq(events.id, id))
    .returning();
  if (!updated) {
    throw new HTTPException(404, { message: 'Event not found' });
  }

  const images = await loadImages(updated.id);
  return c.json({ data: toResponse(updated, images) });
});

// Silence unused import warnings (sql/EVENT_STATUS reserved for future work).
void sql;
void EVENT_STATUS;

export default eventsRoute;
