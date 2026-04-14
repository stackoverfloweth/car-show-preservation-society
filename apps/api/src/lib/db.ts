/**
 * Convenience re-export of the shared Drizzle client for use within the API.
 * Prefer importing from here so route files don't need to reach into the
 * workspace package directly:
 *
 *   import { db } from '../lib/db';
 */
export { db, schema } from '@csps/db';
export type { Database } from '@csps/db';
