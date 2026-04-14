/**
 * Database seeding entry point.
 *
 * Run via `pnpm db:seed`. Populates the database with deterministic sample
 * data for local development. Currently a placeholder — individual domain
 * seeders will be added alongside their schemas in later sessions.
 */
import 'dotenv/config';
import { db } from './index';

export async function seed(): Promise<void> {
  console.log('Seeding database...');

  // Reference the db client so lazy imports aren't tree-shaken; actual
  // seeders will be added alongside their schemas in later sessions.
  void db;

  console.log('Seed complete.');
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  });
