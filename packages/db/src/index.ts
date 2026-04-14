/**
 * Database client for CSPS.
 *
 * Exports a singleton Drizzle ORM instance configured against the PostgreSQL
 * connection described by `DATABASE_URL`. Import `db` from `@csps/db` anywhere
 * you need to query or mutate the database.
 *
 * @example
 *   import { db } from '@csps/db';
 *   const users = await db.query.users.findMany();
 */
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    '[@csps/db] DATABASE_URL is not set. Add it to your environment (see .env.example).',
  );
}

/**
 * Shared postgres-js client. Pool size is tuned for Railway's connection
 * limits in production; locally the default is fine.
 */
const client = postgres(connectionString, {
  max: process.env.NODE_ENV === 'production' ? 10 : 5,
  idle_timeout: 20,
  connect_timeout: 10,
});

/** Drizzle ORM client with schema bindings for relational queries. */
export const db = drizzle(client, { schema });

export { schema };
export type Database = typeof db;

export default db;
