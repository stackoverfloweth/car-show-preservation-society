import { z } from 'zod';

export const userLocationSchema = z.object({
  placeName: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  mapboxId: z.string().min(1),
});

export type UserLocation = z.infer<typeof userLocationSchema>;

/**
 * Body schema for `PUT /api/users/me`. All fields optional — clients send
 * only the fields they want to update.
 */
export const updateUserSchema = z
  .object({
    firstName: z.string().min(1).max(100).nullable(),
    lastName: z.string().min(1).max(100).nullable(),
    phoneNumber: z.string().min(1).max(30).nullable(),
    location: userLocationSchema.nullable(),
    profileImage: z.string().url().nullable(),
    hideEmail: z.boolean(),
    hidePhone: z.boolean(),
    hideLocation: z.boolean(),
  })
  .partial();

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

/**
 * Response shape for user lookups. Privacy-hidden fields are returned as
 * `null` on public profiles so the client never sees them.
 */
export const userResponseSchema = z.object({
  id: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  emailAddress: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  location: userLocationSchema.nullable(),
  profileImage: z.string().nullable(),
  hideEmail: z.boolean(),
  hidePhone: z.boolean(),
  hideLocation: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
});

export type UserResponse = z.infer<typeof userResponseSchema>;
