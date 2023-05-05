export type ClubInvite = {
  clubInviteId: string,
  clubId: string,
  emailAddress: string,
  clubPermissions: string[],
}

export function isClubInvite(value: unknown): value is ClubInvite {
  return !!value && typeof value === 'object'
    && 'clubInviteId' in value && typeof value.clubInviteId === 'string'
    && 'clubId' in value && typeof value.clubId === 'string'
    && 'emailAddress' in value && typeof value.emailAddress === 'string'
}