import { User } from '@/models/user'

export type ClubMembership = {
  clubMembershipId: string,
  clubId: string,
  userId: string,
  clubPermissions: string[],
  user?: User,
}

export function isClubMembership(value: unknown): value is ClubMembership {
  return !!value && typeof value === 'object'
    && 'clubMembershipId' in value && typeof value.clubMembershipId === 'string'
    && 'clubId' in value && typeof value.clubId === 'string'
    && 'userId' in value && typeof value.userId === 'string'
}