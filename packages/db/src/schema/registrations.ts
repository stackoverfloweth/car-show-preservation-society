import {
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { events } from './events';
import { users } from './users';
import { vehicles } from './vehicles';
import { votingCategoryRegistrations } from './voting-category-registrations';

/**
 * Registrations table.
 *
 * Tracks driver registrations for events. A registration can be created via
 * self-service pre-registration (authenticated user) or gate registration
 * (club member host-mode, userId may be null for anonymous walk-ups).
 *
 * `registrationCode` is a 6-char alphanumeric human-readable code used as a
 * fallback to QR scanning. `carId` is assigned at check-in and is sequential
 * per event (not global). The composite unique index on (eventId, carId)
 * ensures no two registrations share the same carId within an event.
 */
export const registrations = pgTable(
  'registrations',
  {
    id: text('id').primaryKey(),
    eventId: text('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    userId: text('user_id').references(() => users.id),
    vehicleId: text('vehicle_id').references(() => vehicles.id),
    registrationCode: text('registration_code').notNull().unique(),
    registrationDate: timestamp('registration_date', { withTimezone: true })
      .notNull()
      .defaultNow(),
    carId: integer('car_id'),
    checkedInAt: timestamp('checked_in_at', { withTimezone: true }),
    stripePaymentId: text('stripe_payment_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }),
  },
  (table) => ({
    eventIdIdx: index('registrations_event_id_idx').on(table.eventId),
    userIdIdx: index('registrations_user_id_idx').on(table.userId),
    vehicleIdIdx: index('registrations_vehicle_id_idx').on(table.vehicleId),
    registrationCodeIdx: index('registrations_registration_code_idx').on(
      table.registrationCode,
    ),
    eventCarIdUnique: uniqueIndex('registrations_event_id_car_id_unique_idx').on(
      table.eventId,
      table.carId,
    ),
    carIdPositive: check(
      'registrations_car_id_positive',
      sql`${table.carId} IS NULL OR ${table.carId} >= 1`,
    ),
  }),
);

export const registrationsRelations = relations(registrations, ({ one, many }) => ({
  event: one(events, {
    fields: [registrations.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [registrations.userId],
    references: [users.id],
  }),
  vehicle: one(vehicles, {
    fields: [registrations.vehicleId],
    references: [vehicles.id],
  }),
  votingCategoryRegistrations: many(votingCategoryRegistrations),
}));

export type Registration = typeof registrations.$inferSelect;
export type NewRegistration = typeof registrations.$inferInsert;
