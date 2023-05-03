import { Registration } from '@/models/registration'

export type VotingResult = {
  votingResultId: string,
  eventId: string,
  votingCategoryId: string,
  registration: Registration,
  place: string,
  placeNumber: number,
}