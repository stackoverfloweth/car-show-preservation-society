import { Registration } from '@/models/registration'

export type VotingResult = {
  eventId: string,
  votingCategoryId: string,
  registration: Registration,
  place: string,
  placeNumber: number,
}