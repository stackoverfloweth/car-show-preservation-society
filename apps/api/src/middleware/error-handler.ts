import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';

export function errorHandler(err: Error, c: Context): Response {
  if (err instanceof HTTPException) {
    const statusCode = err.status;
    console.error(`[error] ${statusCode} ${err.message}`);
    return c.json({ error: err.message, statusCode }, statusCode);
  }

  console.error('[error] Unhandled exception:', err);
  return c.json({ error: 'Internal Server Error', statusCode: 500 }, 500);
}
