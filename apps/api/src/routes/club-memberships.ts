import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { zValidator } from '@hono/zod-validator';
import { and, desc, eq, isNull } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { db } from '../lib/db.js';
import {
  clubApplications,
  clubInvitations,
  clubMemberships,
  clubs,
  users,
  type ClubApplication,
  type ClubInvitation,
  type ClubMembership,
} from '@csps/db';
import { requireAuth } from '../middleware/auth.js';
import { requireClubMember, requireClubPermission } from '../middleware/club-permissions.js';
import {
  CLUB_PERMISSIONS,
  addMemberSchema,
  createApplicationSchema,
  createInvitationSchema,
  reviewApplicationSchema,
  updateMemberSchema,
  type ClubApplicationResponse,
  type ClubInvitationResponse,
  type ClubMembershipResponse,
} from '@csps/shared';

const route = new Hono<{ Variables: { userId: string | undefined } }>();

function membershipToResponse(m: ClubMembership): ClubMembershipResponse {
  return {
    id: m.id,
    clubId: m.clubId,
    userId: m.userId,
    permissions: m.permissions,
    isPrimary: m.isPrimary,
    createdAt: m.createdAt.toISOString(),
    updatedAt: m.updatedAt ? m.updatedAt.toISOString() : null,
  };
}

function invitationToResponse(i: ClubInvitation): ClubInvitationResponse {
  return {
    id: i.id,
    clubId: i.clubId,
    emailAddress: i.emailAddress,
    permissions: i.permissions,
    createdAt: i.createdAt.toISOString(),
    acceptedAt: i.acceptedAt ? i.acceptedAt.toISOString() : null,
  };
}

function applicationToResponse(a: ClubApplication): ClubApplicationResponse {
  return {
    id: a.id,
    clubId: a.clubId,
    userId: a.userId,
    message: a.message,
    status: a.status,
    createdAt: a.createdAt.toISOString(),
    reviewedAt: a.reviewedAt ? a.reviewedAt.toISOString() : null,
    reviewedByUserId: a.reviewedByUserId,
  };
}

async function assertClubExists(clubId: string): Promise<void> {
  const [club] = await db
    .select({ id: clubs.id })
    .from(clubs)
    .where(and(eq(clubs.id, clubId), isNull(clubs.deletedAt)))
    .limit(1);
  if (!club) {
    throw new HTTPException(404, { message: 'Club not found' });
  }
}

// ---------- Members ----------

// GET /api/clubs/:clubId/members — list members (members only)
route.get('/api/clubs/:clubId/members', requireAuth, requireClubMember, async (c) => {
  const clubId = c.req.param('clubId');
  const rows = await db
    .select()
    .from(clubMemberships)
    .where(eq(clubMemberships.clubId, clubId))
    .orderBy(desc(clubMemberships.createdAt));
  return c.json({ data: rows.map(membershipToResponse) });
});

// POST /api/clubs/:clubId/members — direct add (requires MANAGE_MEMBERS)
route.post(
  '/api/clubs/:clubId/members',
  requireAuth,
  requireClubPermission(CLUB_PERMISSIONS.MANAGE_MEMBERS),
  zValidator('json', addMemberSchema),
  async (c) => {
    const clubId = c.req.param('clubId');
    const input = c.req.valid('json');

    const [user] = await db.select({ id: users.id }).from(users).where(eq(users.id, input.userId)).limit(1);
    if (!user) {
      throw new HTTPException(404, { message: 'User not found' });
    }

    const [existing] = await db
      .select()
      .from(clubMemberships)
      .where(and(eq(clubMemberships.clubId, clubId), eq(clubMemberships.userId, input.userId)))
      .limit(1);
    if (existing) {
      throw new HTTPException(409, { message: 'User is already a member' });
    }

    const [created] = await db
      .insert(clubMemberships)
      .values({
        id: nanoid(),
        clubId,
        userId: input.userId,
        permissions: input.permissions,
        isPrimary: input.isPrimary ?? false,
      })
      .returning();

    if (!created) {
      throw new HTTPException(500, { message: 'Failed to create membership' });
    }
    return c.json({ data: membershipToResponse(created) }, 201);
  },
);

// PUT /api/clubs/:clubId/members/:memberId — update (requires MANAGE_MEMBERS)
route.put(
  '/api/clubs/:clubId/members/:memberId',
  requireAuth,
  requireClubPermission(CLUB_PERMISSIONS.MANAGE_MEMBERS),
  zValidator('json', updateMemberSchema),
  async (c) => {
    const clubId = c.req.param('clubId');
    const memberId = c.req.param('memberId');
    const updates = c.req.valid('json');

    const [existing] = await db
      .select()
      .from(clubMemberships)
      .where(and(eq(clubMemberships.id, memberId), eq(clubMemberships.clubId, clubId)))
      .limit(1);
    if (!existing) {
      throw new HTTPException(404, { message: 'Membership not found' });
    }

    const [updated] = await db
      .update(clubMemberships)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(clubMemberships.id, memberId))
      .returning();

    if (!updated) {
      throw new HTTPException(404, { message: 'Membership not found' });
    }
    return c.json({ data: membershipToResponse(updated) });
  },
);

// DELETE /api/clubs/:clubId/members/:memberId — requires MANAGE_MEMBERS or self-leave
route.delete('/api/clubs/:clubId/members/:memberId', requireAuth, async (c) => {
  const clubId = c.req.param('clubId');
  const memberId = c.req.param('memberId');
  const userId = c.get('userId') as string;

  await assertClubExists(clubId);

  const [target] = await db
    .select()
    .from(clubMemberships)
    .where(and(eq(clubMemberships.id, memberId), eq(clubMemberships.clubId, clubId)))
    .limit(1);
  if (!target) {
    throw new HTTPException(404, { message: 'Membership not found' });
  }

  const isSelf = target.userId === userId;
  if (!isSelf) {
    // Check actor has MANAGE_MEMBERS.
    const [actor] = await db
      .select()
      .from(clubMemberships)
      .where(and(eq(clubMemberships.clubId, clubId), eq(clubMemberships.userId, userId)))
      .limit(1);
    if (!actor || !actor.permissions.includes(CLUB_PERMISSIONS.MANAGE_MEMBERS)) {
      throw new HTTPException(403, { message: 'Forbidden' });
    }
  }

  if (target.isPrimary) {
    throw new HTTPException(400, {
      message: 'Cannot remove the primary member; transfer primary status first',
    });
  }

  await db.delete(clubMemberships).where(eq(clubMemberships.id, memberId));
  return c.body(null, 204);
});

// ---------- Invitations ----------

// POST /api/clubs/:clubId/invitations — invite by email
route.post(
  '/api/clubs/:clubId/invitations',
  requireAuth,
  requireClubPermission(CLUB_PERMISSIONS.MANAGE_MEMBERS),
  zValidator('json', createInvitationSchema),
  async (c) => {
    const clubId = c.req.param('clubId');
    const input = c.req.valid('json');

    const [created] = await db
      .insert(clubInvitations)
      .values({
        id: nanoid(),
        clubId,
        emailAddress: input.emailAddress.toLowerCase(),
        permissions: input.permissions,
      })
      .returning();

    if (!created) {
      throw new HTTPException(500, { message: 'Failed to create invitation' });
    }
    return c.json({ data: invitationToResponse(created) }, 201);
  },
);

// GET /api/clubs/:clubId/invitations — list pending invitations (members only)
route.get('/api/clubs/:clubId/invitations', requireAuth, requireClubMember, async (c) => {
  const clubId = c.req.param('clubId');
  const rows = await db
    .select()
    .from(clubInvitations)
    .where(and(eq(clubInvitations.clubId, clubId), isNull(clubInvitations.acceptedAt)))
    .orderBy(desc(clubInvitations.createdAt));
  return c.json({ data: rows.map(invitationToResponse) });
});

// POST /api/clubs/:clubId/invitations/:invitationId/accept
route.post(
  '/api/clubs/:clubId/invitations/:invitationId/accept',
  requireAuth,
  async (c) => {
    const clubId = c.req.param('clubId');
    const invitationId = c.req.param('invitationId');
    const userId = c.get('userId') as string;

    await assertClubExists(clubId);

    const [invitation] = await db
      .select()
      .from(clubInvitations)
      .where(and(eq(clubInvitations.id, invitationId), eq(clubInvitations.clubId, clubId)))
      .limit(1);
    if (!invitation) {
      throw new HTTPException(404, { message: 'Invitation not found' });
    }
    if (invitation.acceptedAt) {
      throw new HTTPException(409, { message: 'Invitation already accepted' });
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) {
      throw new HTTPException(404, { message: 'User not found' });
    }
    if (
      !user.emailAddress ||
      user.emailAddress.toLowerCase() !== invitation.emailAddress.toLowerCase()
    ) {
      throw new HTTPException(403, { message: 'Invitation email does not match your account' });
    }

    const [existingMembership] = await db
      .select()
      .from(clubMemberships)
      .where(and(eq(clubMemberships.clubId, clubId), eq(clubMemberships.userId, userId)))
      .limit(1);

    const membership =
      existingMembership ??
      (
        await db
          .insert(clubMemberships)
          .values({
            id: nanoid(),
            clubId,
            userId,
            permissions: invitation.permissions,
            isPrimary: false,
          })
          .returning()
      )[0];

    await db
      .update(clubInvitations)
      .set({ acceptedAt: new Date() })
      .where(eq(clubInvitations.id, invitationId));

    if (!membership) {
      throw new HTTPException(500, { message: 'Failed to create membership' });
    }
    return c.json({ data: membershipToResponse(membership) }, 201);
  },
);

// ---------- Applications ----------

// POST /api/clubs/:clubId/applications — apply to join
route.post(
  '/api/clubs/:clubId/applications',
  requireAuth,
  zValidator('json', createApplicationSchema),
  async (c) => {
    const clubId = c.req.param('clubId');
    const userId = c.get('userId') as string;
    const input = c.req.valid('json');

    await assertClubExists(clubId);

    const [existingMembership] = await db
      .select({ id: clubMemberships.id })
      .from(clubMemberships)
      .where(and(eq(clubMemberships.clubId, clubId), eq(clubMemberships.userId, userId)))
      .limit(1);
    if (existingMembership) {
      throw new HTTPException(409, { message: 'Already a member of this club' });
    }

    const [existingPending] = await db
      .select({ id: clubApplications.id })
      .from(clubApplications)
      .where(
        and(
          eq(clubApplications.clubId, clubId),
          eq(clubApplications.userId, userId),
          eq(clubApplications.status, 'pending'),
        ),
      )
      .limit(1);
    if (existingPending) {
      throw new HTTPException(409, { message: 'Application already pending' });
    }

    const [created] = await db
      .insert(clubApplications)
      .values({
        id: nanoid(),
        clubId,
        userId,
        message: input.message ?? null,
        status: 'pending',
      })
      .returning();

    if (!created) {
      throw new HTTPException(500, { message: 'Failed to create application' });
    }
    return c.json({ data: applicationToResponse(created) }, 201);
  },
);

// GET /api/clubs/:clubId/applications — list (requires MANAGE_MEMBERS)
route.get(
  '/api/clubs/:clubId/applications',
  requireAuth,
  requireClubPermission(CLUB_PERMISSIONS.MANAGE_MEMBERS),
  async (c) => {
    const clubId = c.req.param('clubId');
    const rows = await db
      .select()
      .from(clubApplications)
      .where(eq(clubApplications.clubId, clubId))
      .orderBy(desc(clubApplications.createdAt));
    return c.json({ data: rows.map(applicationToResponse) });
  },
);

// PUT /api/clubs/:clubId/applications/:applicationId — approve/deny
route.put(
  '/api/clubs/:clubId/applications/:applicationId',
  requireAuth,
  requireClubPermission(CLUB_PERMISSIONS.MANAGE_MEMBERS),
  zValidator('json', reviewApplicationSchema),
  async (c) => {
    const clubId = c.req.param('clubId');
    const applicationId = c.req.param('applicationId');
    const reviewerId = c.get('userId') as string;
    const input = c.req.valid('json');

    const [application] = await db
      .select()
      .from(clubApplications)
      .where(
        and(eq(clubApplications.id, applicationId), eq(clubApplications.clubId, clubId)),
      )
      .limit(1);
    if (!application) {
      throw new HTTPException(404, { message: 'Application not found' });
    }
    if (application.status !== 'pending') {
      throw new HTTPException(409, { message: 'Application is not pending' });
    }

    const [updated] = await db
      .update(clubApplications)
      .set({
        status: input.status,
        reviewedAt: new Date(),
        reviewedByUserId: reviewerId,
      })
      .where(eq(clubApplications.id, applicationId))
      .returning();

    if (!updated) {
      throw new HTTPException(500, { message: 'Failed to update application' });
    }

    if (input.status === 'approved') {
      const [existing] = await db
        .select({ id: clubMemberships.id })
        .from(clubMemberships)
        .where(
          and(
            eq(clubMemberships.clubId, clubId),
            eq(clubMemberships.userId, application.userId),
          ),
        )
        .limit(1);

      if (!existing) {
        await db.insert(clubMemberships).values({
          id: nanoid(),
          clubId,
          userId: application.userId,
          permissions: input.permissions ?? [],
          isPrimary: false,
        });
      }
    }

    return c.json({ data: applicationToResponse(updated) });
  },
);

export default route;
