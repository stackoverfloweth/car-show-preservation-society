import { boolean, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { clubs } from './clubs';
import { users } from './users';

/**
 * Club membership. A row represents a user's role within a club and the
 * permissions they carry. `isPrimary` flags the club's primary contact
 * (initially the creator) — exactly-one enforcement is handled at the
 * application layer for now.
 */
export const clubMemberships = pgTable(
  'club_memberships',
  {
    id: text('id').primaryKey(),
    clubId: text('club_id')
      .notNull()
      .references(() => clubs.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    permissions: text('permissions').array().notNull().default([]),
    isPrimary: boolean('is_primary').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }),
  },
  (table) => ({
    clubUserUnique: uniqueIndex('club_memberships_club_user_unique').on(
      table.clubId,
      table.userId,
    ),
  }),
);

export const clubMembershipsRelations = relations(clubMemberships, ({ one }) => ({
  club: one(clubs, {
    fields: [clubMemberships.clubId],
    references: [clubs.id],
  }),
  user: one(users, {
    fields: [clubMemberships.userId],
    references: [users.id],
  }),
}));

export type ClubMembership = typeof clubMemberships.$inferSelect;
export type NewClubMembership = typeof clubMemberships.$inferInsert;
