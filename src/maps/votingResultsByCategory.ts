import { VotingResultsByCategory } from '@/models'
import { VotingResultsByCategoryResponse } from '@/models/api'
import { MapFunction } from '@/services/mapper'

export const mapVotingResultsByCategoryResponseToVotingResultsByCategory: MapFunction<VotingResultsByCategoryResponse, VotingResultsByCategory> = function(source) {
  return {
    votingCategory: this.map('VotingCategoryResponse', source.votingCategory, 'VotingCategory'),
    results: this.map('VotingResultResponse', source.results, 'VotingResult'),
  }
}