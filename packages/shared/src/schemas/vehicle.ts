import { z } from 'zod';

/**
 * Body schema for `POST /api/vehicles`. Every descriptive field is optional
 * — a driver can create a vehicle with only a make and flesh it out later.
 */
export const createVehicleSchema = z.object({
  make: z.string().min(1).max(100).nullable().optional(),
  model: z.string().min(1).max(100).nullable().optional(),
  year: z.string().min(1).max(20).nullable().optional(),
  description: z.string().max(5000).nullable().optional(),
  color: z.string().min(1).max(50).nullable().optional(),
  modificationCount: z.number().int().min(0).nullable().optional(),
  modifiedAppearance: z.boolean().nullable().optional(),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;

export const updateVehicleSchema = createVehicleSchema.partial();

export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;

export const vehicleImageResponseSchema = z.object({
  id: z.string(),
  vehicleId: z.string(),
  source: z.string(),
  createdAt: z.string(),
});

export type VehicleImageResponse = z.infer<typeof vehicleImageResponseSchema>;

export const vehicleResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  make: z.string().nullable(),
  model: z.string().nullable(),
  year: z.string().nullable(),
  description: z.string().nullable(),
  color: z.string().nullable(),
  modificationCount: z.number().int().nullable(),
  modifiedAppearance: z.boolean().nullable(),
  images: z.array(vehicleImageResponseSchema),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
});

export type VehicleResponse = z.infer<typeof vehicleResponseSchema>;

/**
 * Body schema for `POST /api/vehicles/:id/images`. The frontend uploads to
 * Cloudinary directly and posts the resulting URL here.
 */
export const addVehicleImageSchema = z.object({
  source: z.string().url().max(2000),
});

export type AddVehicleImageInput = z.infer<typeof addVehicleImageSchema>;
