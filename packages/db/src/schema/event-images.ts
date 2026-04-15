import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { events } from './events';

/**
 * Images attached to an event. `source` is the Cloudinary URL returned from
 * the frontend upload widget. Soft-deletable so image removal preserves
 * history.
 */
export const eventImages = pgTable(
  'event_images',
  {
    id: text('id').primaryKey(),
    eventId: text('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    source: text('source').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => ({
    eventIdIdx: index('event_images_event_id_idx').on(table.eventId),
  }),
);

export const eventImagesRelations = relations(eventImages, ({ one }) => ({
  event: one(events, {
    fields: [eventImages.eventId],
    references: [events.id],
  }),
}));

export type EventImage = typeof eventImages.$inferSelect;
export type NewEventImage = typeof eventImages.$inferInsert;
