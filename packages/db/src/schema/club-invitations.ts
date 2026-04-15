import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { clubs } from './clubs';

/**
 * Invitation to join a club, keyed by email address. A user accepting must be
 * authenticated with a matching email. `acceptedAt` marks redemption; rows are
 * kept for audit rather than deleted.
 */
export const clubInvitations = pgTable('club_invitations', {
  id: text('id').primaryKey(),
  clubId: text('club_id')
    .notNull()
    .references(() => clubs.id, { onDelete: 'cascade' }),
  emailAddress: text('email_address').notNull(),
  permissions: text('permissions').array().notNull().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  acceptedAt: timestamp('accepted_at', { withTimezone: true }),
});

export const clubInvitationsRelations = relations(clubInvitations, ({ one }) => ({
  club: one(clubs, {
    fields: [clubInvitations.clubId],
    references: [clubs.id],
  }),
}));

export type ClubInvitation = typeof clubInvitations.$inferSelect;
export type NewClubInvitation = typeof clubInvitations.$inferInsert;
