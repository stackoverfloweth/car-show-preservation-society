import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { and, eq, isNull } from 'drizzle-orm';
import { db } from '../lib/db.js';
import { clubMemberships, clubs, type ClubMembership } from '@csps/db';
import type { ClubPermission } from '@csps/shared';

export type ClubPermissionVariables = {
  userId: string;
  clubMembership: ClubMembership;
};

async function loadMembership(clubId: string, userId: string): Promise<ClubMembership> {
  const [club] = await db
    .select({ id: clubs.id })
    .from(clubs)
    .where(and(eq(clubs.id, clubId), isNull(clubs.deletedAt)))
    .limit(1);

  if (!club) {
    throw new HTTPException(404, { message: 'Club not found' });
  }

  const [membership] = await db
    .select()
    .from(clubMemberships)
    .where(and(eq(clubMemberships.clubId, clubId), eq(clubMemberships.userId, userId)))
    .limit(1);

  if (!membership) {
    throw new HTTPException(403, { message: 'Not a member of this club' });
  }

  return membership;
}

/**
 * Requires the authenticated user to be a member of the club identified by
 * the `:clubId` route param. Stores the membership on the context for
 * downstream handlers.
 */
export const requireClubMember = createMiddleware<{ Variables: ClubPermissionVariables }>(
  async (c, next) => {
    const userId = c.get('userId') as string | undefined;
    if (!userId) {
      throw new HTTPException(401, { message: 'Unauthorized' });
    }

    const clubId = c.req.param('clubId');
    if (!clubId) {
      throw new HTTPException(400, { message: 'Missing clubId' });
    }

    const membership = await loadMembership(clubId, userId);
    c.set('clubMembership', membership);
    await next();
  },
);

/**
 * Requires the authenticated user to have `permission` in their membership's
 * permissions array for the club in the `:clubId` route param.
 */
export function requireClubPermission(permission: ClubPermission) {
  return createMiddleware<{ Variables: ClubPermissionVariables }>(async (c, next) => {
    const userId = c.get('userId') as string | undefined;
    if (!userId) {
      throw new HTTPException(401, { message: 'Unauthorized' });
    }

    const clubId = c.req.param('clubId');
    if (!clubId) {
      throw new HTTPException(400, { message: 'Missing clubId' });
    }

    const membership = await loadMembership(clubId, userId);
    if (!membership.permissions.includes(permission)) {
      throw new HTTPException(403, {
        message: `Missing required permission: ${permission}`,
      });
    }

    c.set('clubMembership', membership);
    await next();
  });
}
