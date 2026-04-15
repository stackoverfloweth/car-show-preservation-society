import { z } from 'zod';
import { CLUB_PERMISSION_VALUES, type ClubPermission } from '../constants/permissions';

const permissionSchema = z.enum(CLUB_PERMISSION_VALUES as [ClubPermission, ...ClubPermission[]]);

export const permissionsArraySchema = z.array(permissionSchema).default([]);

export const addMemberSchema = z.object({
  userId: z.string().min(1),
  permissions: permissionsArraySchema,
  isPrimary: z.boolean().optional(),
});
export type AddMemberInput = z.infer<typeof addMemberSchema>;

export const updateMemberSchema = z.object({
  permissions: permissionsArraySchema.optional(),
  isPrimary: z.boolean().optional(),
});
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;

export const createInvitationSchema = z.object({
  emailAddress: z.string().email(),
  permissions: permissionsArraySchema,
});
export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;

export const createApplicationSchema = z.object({
  message: z.string().max(2000).nullable().optional(),
});
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;

export const reviewApplicationSchema = z.object({
  status: z.enum(['approved', 'denied']),
  permissions: permissionsArraySchema.optional(),
});
export type ReviewApplicationInput = z.infer<typeof reviewApplicationSchema>;

export const clubMembershipResponseSchema = z.object({
  id: z.string(),
  clubId: z.string(),
  userId: z.string(),
  permissions: z.array(z.string()),
  isPrimary: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
});
export type ClubMembershipResponse = z.infer<typeof clubMembershipResponseSchema>;

export const clubInvitationResponseSchema = z.object({
  id: z.string(),
  clubId: z.string(),
  emailAddress: z.string(),
  permissions: z.array(z.string()),
  createdAt: z.string(),
  acceptedAt: z.string().nullable(),
});
export type ClubInvitationResponse = z.infer<typeof clubInvitationResponseSchema>;

export const clubApplicationResponseSchema = z.object({
  id: z.string(),
  clubId: z.string(),
  userId: z.string(),
  message: z.string().nullable(),
  status: z.enum(['pending', 'approved', 'denied']),
  createdAt: z.string(),
  reviewedAt: z.string().nullable(),
  reviewedByUserId: z.string().nullable(),
});
export type ClubApplicationResponse = z.infer<typeof clubApplicationResponseSchema>;
