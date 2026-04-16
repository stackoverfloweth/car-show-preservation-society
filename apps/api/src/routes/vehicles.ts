import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { zValidator } from '@hono/zod-validator';
import { and, asc, desc, eq, gte, isNotNull, isNull, lte } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { db } from '../lib/db.js';
import {
  events,
  registrations,
  users,
  vehicleImages,
  vehicles,
  type Vehicle,
  type VehicleImage,
} from '@csps/db';
import { requireAuth } from '../middleware/auth.js';
import {
  addVehicleImageSchema,
  createVehicleSchema,
  updateVehicleSchema,
  type VehicleImageResponse,
  type VehicleResponse,
} from '@csps/shared';
import { generateVehicleQR, generateQRPNG } from '../lib/qr.js';
import { env } from '../env.js';

const vehiclesRoute = new Hono<{ Variables: { userId: string | undefined } }>();

function imageToResponse(img: VehicleImage): VehicleImageResponse {
  return {
    id: img.id,
    vehicleId: img.vehicleId,
    source: img.source,
    createdAt: img.createdAt.toISOString(),
  };
}

function toResponse(vehicle: Vehicle, images: VehicleImage[]): VehicleResponse {
  return {
    id: vehicle.id,
    userId: vehicle.userId,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    description: vehicle.description,
    color: vehicle.color,
    modificationCount: vehicle.modificationCount,
    modifiedAppearance: vehicle.modifiedAppearance,
    images: images.map(imageToResponse),
    createdAt: vehicle.createdAt.toISOString(),
    updatedAt: vehicle.updatedAt ? vehicle.updatedAt.toISOString() : null,
  };
}

async function loadImages(vehicleId: string): Promise<VehicleImage[]> {
  return db
    .select()
    .from(vehicleImages)
    .where(eq(vehicleImages.vehicleId, vehicleId))
    .orderBy(asc(vehicleImages.createdAt));
}

async function loadVehicleOr404(id: string): Promise<Vehicle> {
  const [vehicle] = await db
    .select()
    .from(vehicles)
    .where(and(eq(vehicles.id, id), isNull(vehicles.deletedAt)))
    .limit(1);
  if (!vehicle) {
    throw new HTTPException(404, { message: 'Vehicle not found' });
  }
  return vehicle;
}

// POST /api/vehicles — create a vehicle owned by the authenticated user.
vehiclesRoute.post(
  '/api/vehicles',
  requireAuth,
  zValidator('json', createVehicleSchema),
  async (c) => {
    const userId = c.get('userId') as string;
    const input = c.req.valid('json');

    const [created] = await db
      .insert(vehicles)
      .values({
        id: nanoid(),
        userId,
        make: input.make ?? null,
        model: input.model ?? null,
        year: input.year ?? null,
        description: input.description ?? null,
        color: input.color ?? null,
        modificationCount: input.modificationCount ?? null,
        modifiedAppearance: input.modifiedAppearance ?? null,
      })
      .returning();

    if (!created) {
      throw new HTTPException(500, { message: 'Failed to create vehicle' });
    }

    return c.json({ data: toResponse(created, []) }, 201);
  },
);

// GET /api/vehicles — list the authenticated user's own vehicles (their garage).
vehiclesRoute.get('/api/vehicles', requireAuth, async (c) => {
  const userId = c.get('userId') as string;

  const rows = await db
    .select()
    .from(vehicles)
    .where(and(eq(vehicles.userId, userId), isNull(vehicles.deletedAt)))
    .orderBy(desc(vehicles.createdAt));

  const responses = await Promise.all(
    rows.map(async (v) => toResponse(v, await loadImages(v.id))),
  );

  return c.json({ data: responses });
});

// GET /api/vehicles/:id — public detail endpoint (used by voting QR codes).
vehiclesRoute.get('/api/vehicles/:id', async (c) => {
  const id = c.req.param('id');
  const vehicle = await loadVehicleOr404(id);
  const images = await loadImages(vehicle.id);
  return c.json({ data: toResponse(vehicle, images) });
});

// PUT /api/vehicles/:id — owner only.
vehiclesRoute.put(
  '/api/vehicles/:id',
  requireAuth,
  zValidator('json', updateVehicleSchema),
  async (c) => {
    const id = c.req.param('id');
    const userId = c.get('userId') as string;
    const updates = c.req.valid('json');

    const existing = await loadVehicleOr404(id);
    if (existing.userId !== userId) {
      throw new HTTPException(403, { message: 'Forbidden' });
    }

    const [updated] = await db
      .update(vehicles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(vehicles.id, id))
      .returning();

    if (!updated) {
      throw new HTTPException(404, { message: 'Vehicle not found' });
    }

    const images = await loadImages(updated.id);
    return c.json({ data: toResponse(updated, images) });
  },
);

// DELETE /api/vehicles/:id — soft delete (owner only).
vehiclesRoute.delete('/api/vehicles/:id', requireAuth, async (c) => {
  const id = c.req.param('id');
  const userId = c.get('userId') as string;

  const existing = await loadVehicleOr404(id);
  if (existing.userId !== userId) {
    throw new HTTPException(403, { message: 'Forbidden' });
  }

  await db
    .update(vehicles)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(vehicles.id, id));

  return c.body(null, 204);
});

// POST /api/vehicles/:id/images — attach a Cloudinary URL (owner only).
vehiclesRoute.post(
  '/api/vehicles/:id/images',
  requireAuth,
  zValidator('json', addVehicleImageSchema),
  async (c) => {
    const id = c.req.param('id');
    const userId = c.get('userId') as string;
    const input = c.req.valid('json');

    const vehicle = await loadVehicleOr404(id);
    if (vehicle.userId !== userId) {
      throw new HTTPException(403, { message: 'Forbidden' });
    }

    const [created] = await db
      .insert(vehicleImages)
      .values({
        id: nanoid(),
        vehicleId: vehicle.id,
        source: input.source,
      })
      .returning();

    if (!created) {
      throw new HTTPException(500, { message: 'Failed to add image' });
    }

    return c.json({ data: imageToResponse(created) }, 201);
  },
);

// DELETE /api/vehicles/:id/images/:imageId — remove image (owner only).
vehiclesRoute.delete('/api/vehicles/:id/images/:imageId', requireAuth, async (c) => {
  const id = c.req.param('id');
  const imageId = c.req.param('imageId');
  const userId = c.get('userId') as string;

  const vehicle = await loadVehicleOr404(id);
  if (vehicle.userId !== userId) {
    throw new HTTPException(403, { message: 'Forbidden' });
  }

  const [image] = await db
    .select()
    .from(vehicleImages)
    .where(and(eq(vehicleImages.id, imageId), eq(vehicleImages.vehicleId, id)))
    .limit(1);

  if (!image) {
    throw new HTTPException(404, { message: 'Image not found' });
  }

  await db.delete(vehicleImages).where(eq(vehicleImages.id, imageId));
  return c.body(null, 204);
});

// GET /api/vehicles/:id/active-registration — find active registration for this vehicle (public).
vehiclesRoute.get('/api/vehicles/:id/active-registration', async (c) => {
  const vehicleId = c.req.param('id');
  const vehicle = await loadVehicleOr404(vehicleId);

  const now = new Date();
  const rows = await db
    .select({
      registration: registrations,
      event: events,
    })
    .from(registrations)
    .innerJoin(events, eq(registrations.eventId, events.id))
    .where(
      and(
        eq(registrations.vehicleId, vehicle.id),
        isNotNull(registrations.carId),
        lte(events.startDate, now),
        gte(events.endDate, now),
        isNull(events.deletedAt),
      ),
    )
    .orderBy(desc(events.startDate))
    .limit(1);

  if (rows.length === 0) {
    throw new HTTPException(404, { message: 'No active registration found for this vehicle' });
  }

  const { registration, event } = rows[0]!;
  const images = await loadImages(vehicle.id);

  return c.json({
    data: {
      registration: {
        id: registration.id,
        eventId: registration.eventId,
        carId: registration.carId,
        registrationCode: registration.registrationCode,
        checkedInAt: registration.checkedInAt ? registration.checkedInAt.toISOString() : null,
      },
      event: {
        id: event.id,
        name: event.name,
        startDate: event.startDate ? event.startDate.toISOString() : null,
        endDate: event.endDate ? event.endDate.toISOString() : null,
      },
      vehicle: toResponse(vehicle, images),
    },
  });
});

// GET /api/vehicles/:id/qr — permanent vehicle QR code image (public).
vehiclesRoute.get('/api/vehicles/:id/qr', async (c) => {
  const vehicleId = c.req.param('id');
  await loadVehicleOr404(vehicleId);

  const url = `${env.FRONTEND_URL}/vote/${vehicleId}`;
  const png = await generateQRPNG(url);

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400',
    },
  });
});

// GET /api/users/:userId/vehicles — public listing of a user's vehicles.
vehiclesRoute.get('/api/users/:userId/vehicles', async (c) => {
  const userId = c.req.param('userId');

  const [user] = await db.select({ id: users.id }).from(users).where(eq(users.id, userId)).limit(1);
  if (!user) {
    throw new HTTPException(404, { message: 'User not found' });
  }

  const rows = await db
    .select()
    .from(vehicles)
    .where(and(eq(vehicles.userId, userId), isNull(vehicles.deletedAt)))
    .orderBy(desc(vehicles.createdAt));

  const responses = await Promise.all(
    rows.map(async (v) => toResponse(v, await loadImages(v.id))),
  );

  return c.json({ data: responses });
});

export default vehiclesRoute;
