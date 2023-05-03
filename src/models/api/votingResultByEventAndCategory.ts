import { EventResponse } from '@/models/api/eventResponse'
import { VotingCategoryResponse } from '@/models/api/votingCategoryResponse'
import { VotingResultResponse } from '@/models/api/votingResultResponse'

export type VotingResultByEventAndCategoryResponse = {
  event: EventResponse,
  votingCategory: VotingCategoryResponse,
  result: VotingResultResponse,
}