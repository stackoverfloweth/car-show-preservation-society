import { index, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { votingCategories } from './voting-categories';

/**
 * Junction table mapping registrations to voting categories.
 *
 * NOTE: `registrationId` is intentionally a plain text column without a
 * foreign-key constraint. The `registrations` table is created in Session 11;
 * the FK constraint to `registrations.id` will be added then.
 */
export const votingCategoryRegistrations = pgTable(
  'voting_category_registrations',
  {
    id: text('id').primaryKey(),
    votingCategoryId: text('voting_category_id')
      .notNull()
      .references(() => votingCategories.id, { onDelete: 'cascade' }),
    // FK constraint to registrations.id will be added in Session 11.
    registrationId: text('registration_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    votingCategoryIdIdx: index('vcr_voting_category_id_idx').on(table.votingCategoryId),
    registrationIdIdx: index('vcr_registration_id_idx').on(table.registrationId),
    uniqueAssignment: uniqueIndex('vcr_category_registration_unique_idx').on(
      table.votingCategoryId,
      table.registrationId,
    ),
  }),
);

export const votingCategoryRegistrationsRelations = relations(
  votingCategoryRegistrations,
  ({ one }) => ({
    votingCategory: one(votingCategories, {
      fields: [votingCategoryRegistrations.votingCategoryId],
      references: [votingCategories.id],
    }),
  }),
);

export type VotingCategoryRegistration = typeof votingCategoryRegistrations.$inferSelect;
export type NewVotingCategoryRegistration =
  typeof votingCategoryRegistrations.$inferInsert;
