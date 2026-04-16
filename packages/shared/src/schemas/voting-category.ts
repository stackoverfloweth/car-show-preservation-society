import { z } from 'zod';

/**
 * Fields shared between create and update. `name` is required for create but
 * optional for update (via `.partial()`).
 */
const votingCategoryFieldsSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).nullable().optional(),
  maxCapacity: z.number().int().positive().nullable().optional(),
  driversOnly: z.boolean().optional(),
  membersOnly: z.boolean().optional(),
  automaticEntry: z.boolean().optional(),
  featured: z.boolean().optional(),
  stripePriceId: z.string().min(1).nullable().optional(),
});

type VotingCategoryRefineInput = Partial<z.infer<typeof votingCategoryFieldsSchema>> & {
  charge?: boolean;
};

// Disallow empty-string stripePriceId when set. Positive maxCapacity is
// already enforced by `.positive()` above.
const refineVotingCategory = (
  data: VotingCategoryRefineInput,
  ctx: z.RefinementCtx,
) => {
  if (data.stripePriceId !== undefined && data.stripePriceId !== null) {
    if (data.stripePriceId.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['stripePriceId'],
        message: 'stripePriceId must be non-empty when charging for a category',
      });
    }
  }
};

export const createVotingCategorySchema =
  votingCategoryFieldsSchema.superRefine(refineVotingCategory);
export type CreateVotingCategoryInput = z.infer<typeof createVotingCategorySchema>;
// Session file name (PascalCase) alias.
export const CreateVotingCategorySchema = createVotingCategorySchema;

export const updateVotingCategorySchema = votingCategoryFieldsSchema
  .partial()
  .superRefine(refineVotingCategory);
export type UpdateVotingCategoryInput = z.infer<typeof updateVotingCategorySchema>;
export const UpdateVotingCategorySchema = updateVotingCategorySchema;

export const votingCategoryResponseSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  maxCapacity: z.number().int().nullable(),
  driversOnly: z.boolean(),
  membersOnly: z.boolean(),
  automaticEntry: z.boolean(),
  featured: z.boolean(),
  stripePriceId: z.string().nullable(),
  entryCount: z.number().int(),
  registrationIds: z.array(z.string()).optional(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
});
export type VotingCategoryResponse = z.infer<typeof votingCategoryResponseSchema>;
export const VotingCategorySchema = votingCategoryResponseSchema;

export const assignRegistrationSchema = z.object({
  registrationId: z.string().min(1),
});
export type AssignRegistrationInput = z.infer<typeof assignRegistrationSchema>;

export const votingCategoryRegistrationResponseSchema = z.object({
  id: z.string(),
  votingCategoryId: z.string(),
  registrationId: z.string(),
  createdAt: z.string(),
});
export type VotingCategoryRegistrationResponse = z.infer<
  typeof votingCategoryRegistrationResponseSchema
>;
