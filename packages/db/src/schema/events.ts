import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { clubs } from './clubs';
import { users } from './users';
import { eventImages } from './event-images';

/**
 * Event location as stored in the `location` jsonb column.
 */
export type EventLocation = {
  address: string;
  lat: number;
  lng: number;
};

/**
 * Events table.
 *
 * Core of the event management system. Every event is owned by a club and
 * has a responsible contact user (initially the club's contactUser). Voting,
 * registration, and payment configuration live inline on the row.
 *
 * `votingStart`/`votingEnd` may be null when voting is manually triggered.
 * Status is not stored — it's derived from dates via `deriveEventStatus`.
 * Soft deletion via `deletedAt`.
 */
export const events = pgTable(
  'events',
  {
    id: text('id').primaryKey(),
    clubId: text('club_id')
      .notNull()
      .references(() => clubs.id, { onDelete: 'cascade' }),
    contactUserId: text('contact_user_id')
      .notNull()
      .references(() => users.id),
    name: text('name').notNull(),
    location: jsonb('location').$type<EventLocation>(),
    startDate: timestamp('start_date', { withTimezone: true }),
    endDate: timestamp('end_date', { withTimezone: true }),

    // Voting configuration
    votingStart: timestamp('voting_start', { withTimezone: true }),
    votingEnd: timestamp('voting_end', { withTimezone: true }),
    ballotCount: integer('ballot_count').notNull().default(1),
    canVoteForSelf: boolean('can_vote_for_self').notNull().default(false),
    driverSelfCategorization: boolean('driver_self_categorization').notNull().default(false),
    maxSelfCategorization: integer('max_self_categorization'),

    // Registration configuration
    maxCapacity: integer('max_capacity'),
    preRegistration: boolean('pre_registration').notNull().default(true),
    preRegistrationUnpaid: boolean('pre_registration_unpaid').notNull().default(false),

    // Payment fields
    stripePriceId: text('stripe_price_id'),
    preRegistrationStripePriceId: text('pre_registration_stripe_price_id'),
    stripeCrossProductIds: text('stripe_cross_product_ids')
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => ({
    clubIdIdx: index('events_club_id_idx').on(table.clubId),
    startDateIdx: index('events_start_date_idx').on(table.startDate),
    clubStartIdx: index('events_club_id_start_date_idx').on(table.clubId, table.startDate),
  }),
);

export const eventsRelations = relations(events, ({ one, many }) => ({
  club: one(clubs, {
    fields: [events.clubId],
    references: [clubs.id],
  }),
  contactUser: one(users, {
    fields: [events.contactUserId],
    references: [users.id],
  }),
  images: many(eventImages),
}));

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
