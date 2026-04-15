import './env.js';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { errorHandler } from './middleware/error-handler.js';
import { requestId } from './middleware/request-id.js';
import health from './routes/health.js';
import me from './routes/me.js';
import users from './routes/users.js';
import clubs from './routes/clubs.js';
import clubMemberships from './routes/club-memberships.js';
import events from './routes/events.js';
import vehicles from './routes/vehicles.js';
import clerkWebhooks from './routes/clerk-webhooks.js';
import { env } from './env.js';

const app = new Hono();

// Middleware (applied in order)
app.use('*', logger());
app.use('*', requestId);
app.use(
  '*',
  cors({
    origin: env.API_URL ?? '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

// Routes
app.route('/', health);
app.route('/', me);
app.route('/', users);
app.route('/', clubs);
app.route('/', clubMemberships);
app.route('/', events);
app.route('/', vehicles);
app.route('/', clerkWebhooks);

// Global error handler
app.onError(errorHandler);

export default app;
