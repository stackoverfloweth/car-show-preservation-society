import { Event } from '@/models/event'
import { VotingCategory } from '@/models/votingCategory'
import { VotingResult } from '@/models/votingResult'

export type VotingResultByEventAndCategory = {
  event: Event,
  votingCategory: VotingCategory,
  result: VotingResult,
}