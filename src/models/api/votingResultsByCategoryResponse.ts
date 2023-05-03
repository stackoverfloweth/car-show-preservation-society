import { VotingCategoryResponse } from '@/models/api/votingCategoryResponse'
import { VotingResultResponse } from '@/models/api/votingResultResponse'

export type VotingResultsByCategoryResponse = {
  votingCategory: VotingCategoryResponse,
  results: VotingResultResponse[],
}