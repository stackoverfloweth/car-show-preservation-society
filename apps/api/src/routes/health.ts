import { Hono } from 'hono';
import type { HealthResponse } from '../types/index.js';

const health = new Hono();

health.get('/api/health', (c) => {
  const body: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
  };
  return c.json(body, 200);
});

export default health;
