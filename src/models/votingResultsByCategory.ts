import { VotingCategory } from '@/models/votingCategory'
import { VotingResult } from '@/models/votingResult'

export type VotingResultsByCategory = {
  votingCategory: VotingCategory,
  results: VotingResult[],
}