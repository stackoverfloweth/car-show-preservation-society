import { eq, isNotNull, sql } from 'drizzle-orm';
import { registrations } from '@csps/db';
import type { Database } from '@csps/db';

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 6;
const MAX_RETRIES = 10;

/**
 * Generates a unique 6-character alphanumeric registration code.
 *
 * Uses a character set that excludes ambiguous characters (0/O, 1/I) for
 * readability. Checks uniqueness against the database and retries on
 * collision (extremely unlikely with ~800M possible combinations).
 */
export async function generateRegistrationCode(db: Database): Promise<string> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    let code = '';
    for (let i = 0; i < CODE_LENGTH; i++) {
      code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
    }

    const [existing] = await db
      .select({ id: registrations.id })
      .from(registrations)
      .where(eq(registrations.registrationCode, code))
      .limit(1);

    if (!existing) {
      return code;
    }
  }

  throw new Error('Failed to generate unique registration code after maximum retries');
}

/**
 * Gets the next sequential carId for an event.
 *
 * Uses a subquery with FOR UPDATE row-level locking to prevent race
 * conditions when multiple check-ins happen concurrently. Returns 1 if
 * no registrations have been checked in yet.
 */
export async function getNextCarId(eventId: string, db: Database): Promise<number> {
  const result = await db.execute<{ next_car_id: number }>(
    sql`
      SELECT COALESCE(
        (
          SELECT MAX(${registrations.carId}) + 1
          FROM ${registrations}
          WHERE ${registrations.eventId} = ${eventId}
            AND ${registrations.carId} IS NOT NULL
          FOR UPDATE
        ),
        1
      ) AS next_car_id
    `,
  );

  const rows = (result as unknown as { rows?: { next_car_id: number }[] }).rows
    ?? (result as unknown as { next_car_id: number }[]);
  const row = Array.isArray(rows) ? rows[0] : undefined;
  return row?.next_car_id ?? 1;
}
