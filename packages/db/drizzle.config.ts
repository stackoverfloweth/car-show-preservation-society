import type { Config } from 'drizzle-kit';
import 'dotenv/config';

/**
 * Drizzle Kit configuration.
 *
 * Reads DATABASE_URL from the environment. Generated migrations live in
 * `./drizzle` and schema definitions are sourced from `./src/schema`.
 */
export default {
  schema: './src/schema',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
  strict: true,
  verbose: true,
} satisfies Config;
