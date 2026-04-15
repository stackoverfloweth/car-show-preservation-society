import { z } from 'zod';

/**
 * Body schema for `POST /api/clubs`. The authenticated user becomes the
 * contact by default; callers cannot set `contactUserId` at creation time.
 */
export const createClubSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(5000).default(''),
  clubLogo: z.string().url().nullable().optional(),
  joinable: z.boolean().optional(),
  visible: z.boolean().optional(),
});

export type CreateClubInput = z.infer<typeof createClubSchema>;

/**
 * Body schema for `PUT /api/clubs/:id`. All fields optional — clients send
 * only what they want to change. `contactUserId` may be reassigned to another
 * user (ownership transfer).
 */
export const updateClubSchema = z
  .object({
    name: z.string().min(1).max(200),
    description: z.string().max(5000),
    clubLogo: z.string().url().nullable(),
    contactUserId: z.string().min(1),
    joinable: z.boolean(),
    visible: z.boolean(),
  })
  .partial();

export type UpdateClubInput = z.infer<typeof updateClubSchema>;

export const clubResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  clubLogo: z.string().nullable(),
  contactUserId: z.string(),
  joinable: z.boolean(),
  visible: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
});

export type ClubResponse = z.infer<typeof clubResponseSchema>;

export const listClubsQuerySchema = z.object({
  q: z.string().min(1).max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type ListClubsQuery = z.infer<typeof listClubsQuerySchema>;
