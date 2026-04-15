import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { Webhook } from 'svix';
import { eq } from 'drizzle-orm';
import { db } from '../lib/db.js';
import { users } from '@csps/db';
import { env } from '../env.js';

const clerkWebhooks = new Hono();

type ClerkEmailAddress = { id: string; email_address: string };
type ClerkPhoneNumber = { id: string; phone_number: string };

type ClerkUserData = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  primary_email_address_id: string | null;
  primary_phone_number_id: string | null;
  email_addresses: ClerkEmailAddress[];
  phone_numbers: ClerkPhoneNumber[];
};

type ClerkEvent =
  | { type: 'user.created' | 'user.updated'; data: ClerkUserData }
  | { type: 'user.deleted'; data: { id: string } };

function primaryEmail(data: ClerkUserData): string | null {
  const match = data.email_addresses.find((e) => e.id === data.primary_email_address_id);
  return match?.email_address ?? data.email_addresses[0]?.email_address ?? null;
}

function primaryPhone(data: ClerkUserData): string | null {
  const match = data.phone_numbers.find((p) => p.id === data.primary_phone_number_id);
  return match?.phone_number ?? data.phone_numbers[0]?.phone_number ?? null;
}

clerkWebhooks.post('/api/webhooks/clerk', async (c) => {
  if (!env.CLERK_WEBHOOK_SECRET) {
    throw new HTTPException(500, { message: 'CLERK_WEBHOOK_SECRET not configured' });
  }

  const svixId = c.req.header('svix-id');
  const svixTimestamp = c.req.header('svix-timestamp');
  const svixSignature = c.req.header('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    throw new HTTPException(400, { message: 'Missing svix headers' });
  }

  const payload = await c.req.text();
  const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);

  let event: ClerkEvent;
  try {
    event = wh.verify(payload, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as ClerkEvent;
  } catch {
    throw new HTTPException(400, { message: 'Invalid webhook signature' });
  }

  switch (event.type) {
    case 'user.created': {
      const d = event.data;
      await db
        .insert(users)
        .values({
          id: d.id,
          emailAddress: primaryEmail(d),
          phoneNumber: primaryPhone(d),
          firstName: d.first_name,
          lastName: d.last_name,
          profileImage: d.image_url,
        })
        .onConflictDoNothing({ target: users.id });
      break;
    }
    case 'user.updated': {
      const d = event.data;
      await db
        .update(users)
        .set({
          emailAddress: primaryEmail(d),
          phoneNumber: primaryPhone(d),
          firstName: d.first_name,
          lastName: d.last_name,
          profileImage: d.image_url,
          updatedAt: new Date(),
        })
        .where(eq(users.id, d.id));
      break;
    }
    case 'user.deleted': {
      await db.delete(users).where(eq(users.id, event.data.id));
      break;
    }
  }

  return c.json({ received: true });
});

export default clerkWebhooks;
