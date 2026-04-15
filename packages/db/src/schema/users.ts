import { boolean, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * User location shape stored as JSONB. Populated from a Mapbox place result.
 */
export type UserLocation = {
  placeName: string;
  latitude: number;
  longitude: number;
  mapboxId: string;
};

/**
 * Users table.
 *
 * The primary key is the Clerk user ID (e.g. `user_2aB...`), kept in sync by
 * the `/api/webhooks/clerk` handler. All profile fields are nullable because
 * Clerk may not provide every field at signup time.
 */
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  emailAddress: text('email_address'),
  phoneNumber: text('phone_number'),
  firstName: text('first_name'),
  lastName: text('last_name'),
  location: jsonb('location').$type<UserLocation>(),
  profileImage: text('profile_image'),
  stripeCustomerId: text('stripe_customer_id'),
  hideEmail: boolean('hide_email').notNull().default(false),
  hidePhone: boolean('hide_phone').notNull().default(false),
  hideLocation: boolean('hide_location').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
