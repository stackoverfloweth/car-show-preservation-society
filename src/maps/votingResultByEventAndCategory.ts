import { VotingResultByEventAndCategoryResponse } from '@/models/api'
import { VotingResultByEventAndCategory } from '@/models/votingResultByEventAndCategory'
import { MapFunction } from '@/services/mapper'

export const mapVotingResultByEventAndCategoryResponseToVotingResultByEventAndCategory: MapFunction<VotingResultByEventAndCategoryResponse, VotingResultByEventAndCategory> = function(source) {
  return {
    event: this.map('EventResponse', source.event, 'Event'),
    votingCategory: this.map('VotingCategoryResponse', source.votingCategory, 'VotingCategory'),
    result: this.map('VotingResultResponse', source.result, 'VotingResult'),
  }
}