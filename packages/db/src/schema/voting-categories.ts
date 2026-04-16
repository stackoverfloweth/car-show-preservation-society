import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { events } from './events';
import { votingCategoryRegistrations } from './voting-category-registrations';

/**
 * Voting categories for an event (e.g., "Best Paint", "Club Choice").
 *
 * `driversOnly` restricts voting to ballots from registrations; `membersOnly`
 * restricts to ballots from club memberships. `automaticEntry` auto-assigns
 * every existing registration when the category is created. Optional
 * `stripePriceId` charges drivers extra to be entered in the category.
 */
export const votingCategories = pgTable(
  'voting_categories',
  {
    id: text('id').primaryKey(),
    eventId: text('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    description: text('description'),
    maxCapacity: integer('max_capacity'),
    driversOnly: boolean('drivers_only').notNull().default(false),
    membersOnly: boolean('members_only').notNull().default(false),
    automaticEntry: boolean('automatic_entry').notNull().default(false),
    featured: boolean('featured').notNull().default(false),
    stripePriceId: text('stripe_price_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }),
  },
  (table) => ({
    eventIdIdx: index('voting_categories_event_id_idx').on(table.eventId),
    eventNameUnique: uniqueIndex('voting_categories_event_id_name_idx').on(
      table.eventId,
      table.name,
    ),
  }),
);

export const votingCategoriesRelations = relations(votingCategories, ({ one, many }) => ({
  event: one(events, {
    fields: [votingCategories.eventId],
    references: [events.id],
  }),
  registrations: many(votingCategoryRegistrations),
}));

export type VotingCategory = typeof votingCategories.$inferSelect;
export type NewVotingCategory = typeof votingCategories.$inferInsert;
