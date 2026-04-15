import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { clubs } from './clubs';
import { users } from './users';

export const CLUB_APPLICATION_STATUSES = ['pending', 'approved', 'denied'] as const;
export type ClubApplicationStatus = (typeof CLUB_APPLICATION_STATUSES)[number];

/**
 * User-initiated application to join a club. Moves from `pending` to
 * `approved` or `denied` by a member with MANAGE_MEMBERS. Approval triggers
 * creation of a clubMembership row at the application layer.
 */
export const clubApplications = pgTable('club_applications', {
  id: text('id').primaryKey(),
  clubId: text('club_id')
    .notNull()
    .references(() => clubs.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  message: text('message'),
  status: text('status').notNull().default('pending').$type<ClubApplicationStatus>(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  reviewedByUserId: text('reviewed_by_user_id').references(() => users.id),
});

export const clubApplicationsRelations = relations(clubApplications, ({ one }) => ({
  club: one(clubs, {
    fields: [clubApplications.clubId],
    references: [clubs.id],
  }),
  user: one(users, {
    fields: [clubApplications.userId],
    references: [users.id],
  }),
  reviewedByUser: one(users, {
    fields: [clubApplications.reviewedByUserId],
    references: [users.id],
  }),
}));

export type ClubApplication = typeof clubApplications.$inferSelect;
export type NewClubApplication = typeof clubApplications.$inferInsert;
