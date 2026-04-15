import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { vehicleImages } from './vehicle-images';

/**
 * Vehicles ("garage") table.
 *
 * A vehicle belongs to a single user. Fields are intentionally generic
 * (make/model/year/color/description) so the schema can later support
 * vehicles beyond cars (motorcycles, trucks, boats, etc.). All descriptive
 * fields are nullable — drivers are free to fill in as much or as little as
 * they want. `deletedAt` supports soft deletion.
 */
export const vehicles = pgTable('vehicles', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  make: text('make'),
  model: text('model'),
  year: text('year'),
  description: text('description'),
  color: text('color'),
  modificationCount: integer('modification_count'),
  modifiedAppearance: boolean('modified_appearance'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  user: one(users, {
    fields: [vehicles.userId],
    references: [users.id],
  }),
  images: many(vehicleImages),
}));

export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;
