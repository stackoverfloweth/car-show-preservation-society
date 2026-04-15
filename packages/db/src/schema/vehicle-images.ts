import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { vehicles } from './vehicles';

/**
 * Images attached to a vehicle. `source` is the Cloudinary URL returned from
 * the frontend upload widget. Rows are deleted when the parent vehicle is
 * hard-deleted (cascade); soft-deleted vehicles keep their image rows.
 */
export const vehicleImages = pgTable('vehicle_images', {
  id: text('id').primaryKey(),
  vehicleId: text('vehicle_id')
    .notNull()
    .references(() => vehicles.id, { onDelete: 'cascade' }),
  source: text('source').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const vehicleImagesRelations = relations(vehicleImages, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [vehicleImages.vehicleId],
    references: [vehicles.id],
  }),
}));

export type VehicleImage = typeof vehicleImages.$inferSelect;
export type NewVehicleImage = typeof vehicleImages.$inferInsert;
