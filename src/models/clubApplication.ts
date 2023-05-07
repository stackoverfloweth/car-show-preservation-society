import { User } from '@/models/user'

export type ClubApplication = {
  clubApplicationId: string,
  clubId: string,
  userId: string,
  message?: string,
  user?: User,
}

export function isClubApplication(value: unknown): value is ClubApplication {
  return !!value && typeof value === 'object'
    && 'clubApplicationId' in value && typeof value.clubApplicationId === 'string'
    && 'clubId' in value && typeof value.clubId === 'string'
    && 'userId' in value && typeof value.userId === 'string'
}