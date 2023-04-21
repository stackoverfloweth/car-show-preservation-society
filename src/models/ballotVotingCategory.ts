import { VotingCategory } from '@/models/votingCategory'

export type BallotVotingCategory = {
  ballotVotingCategoryId: string,
  ballotId: string,
  votingCategory: VotingCategory,
  carId?: string,
  disqualified?: boolean,
}