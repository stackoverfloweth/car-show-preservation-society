import { index, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { votingCategories } from './voting-categories';
import { registrations } from './registrations';

/**
 * Junction table mapping registrations to voting categories.
 */
export const votingCategoryRegistrations = pgTable(
  'voting_category_registrations',
  {
    id: text('id').primaryKey(),
    votingCategoryId: text('voting_category_id')
      .notNull()
      .references(() => votingCategories.id, { onDelete: 'cascade' }),
    registrationId: text('registration_id')
      .notNull()
      .references(() => registrations.id, { onDelete: 'cascade' }),
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
    registration: one(registrations, {
      fields: [votingCategoryRegistrations.registrationId],
      references: [registrations.id],
    }),
  }),
);

export type VotingCategoryRegistration = typeof votingCategoryRegistrations.$inferSelect;
export type NewVotingCategoryRegistration =
  typeof votingCategoryRegistrations.$inferInsert;
