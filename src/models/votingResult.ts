import { Registration } from '@/models/registration'

export type VotingResult = {
  votingCategoryId: string,
  registration: Registration,
  place: string,
}