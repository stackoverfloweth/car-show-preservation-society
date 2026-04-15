/**
 * Permission strings for club-scoped authorization.
 *
 * Each membership row carries an array of these strings; the
 * `requireClubPermission` middleware checks that the authenticated user's
 * membership includes the needed permission for the `:clubId` route param.
 *
 * Keep values stable — they are persisted in the database.
 */
export const CLUB_PERMISSIONS = {
  CREATE_EVENTS: 'CREATE_EVENTS',
  MANAGE_MEMBERS: 'MANAGE_MEMBERS',
  START_VOTING: 'START_VOTING',
  END_VOTING: 'END_VOTING',
  BYPASS_REGISTRATION: 'BYPASS_REGISTRATION',
  CREATE_VOTING_CATEGORY: 'CREATE_VOTING_CATEGORY',
  MANAGE_SPONSORS: 'MANAGE_SPONSORS',
  SEND_MESSAGES: 'SEND_MESSAGES',
} as const;

export type ClubPermission = (typeof CLUB_PERMISSIONS)[keyof typeof CLUB_PERMISSIONS];

export const ALL_CLUB_PERMISSIONS: ClubPermission[] = Object.values(CLUB_PERMISSIONS);

export const CLUB_PERMISSION_VALUES = ALL_CLUB_PERMISSIONS;
