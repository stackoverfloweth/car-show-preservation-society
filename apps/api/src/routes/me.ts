import { Hono } from 'hono';
import { requireAuth } from '../middleware/auth.js';
import type { MeResponse } from '../types/index.js';

const me = new Hono<{ Variables: { userId: string } }>();

me.get('/api/me', requireAuth, (c) => {
  const userId = c.get('userId');
  const body: MeResponse = {
    userId,
    createdAt: new Date().toISOString(),
  };
  return c.json(body, 200);
});

export default me;
