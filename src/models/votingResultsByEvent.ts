import { Event } from '@/models/event'
import { VotingResult } from '@/models/votingResult'

export type VotingResultsByEvent = {
  event: Event,
  result: VotingResult,
}