import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

/**
 * Clubs table.
 *
 * A club is the organizational unit that owns events. Any user can create a
 * club — even a one-person "club" for solo organizers. The `contactUserId`
 * points at the responsible user (initially the creator) and is the owner for
 * permission checks until session 07 introduces proper role-based membership.
 *
 * `joinable` controls whether users can freely apply to join; `visible`
 * controls whether the club appears in public listings. `deletedAt` supports
 * soft deletion — delete endpoints set this rather than removing the row.
 */
export const clubs = pgTable('clubs', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  clubLogo: text('club_logo'),
  contactUserId: text('contact_user_id')
    .notNull()
    .references(() => users.id),
  stripeCustomerId: text('stripe_customer_id'),
  joinable: boolean('joinable').notNull().default(true),
  visible: boolean('visible').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const clubsRelations = relations(clubs, ({ one }) => ({
  contactUser: one(users, {
    fields: [clubs.contactUserId],
    references: [users.id],
  }),
}));

export type Club = typeof clubs.$inferSelect;
export type NewClub = typeof clubs.$inferInsert;
