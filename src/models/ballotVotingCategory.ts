import { VotingCategory } from '@/models/votingCategory'

export type BallotVotingCategory = {
  ballotVotingCategoryId: string,
  votingCategory: VotingCategory,
  carId?: string,
  disqualified?: boolean,
}