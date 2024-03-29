import { VotingResultsCount, VotingResultsByCategory, VotingResultByEventAndCategory } from '@/models'
import { VotingResultByEventAndCategoryResponse, VotingResultsByCategoryResponse } from '@/models/api'
import { Api, composeAuthHeaders, mapper } from '@/services'

export class VotingResultsApi extends Api {
  public setVotingResults(eventId: string): Promise<void> {
    return this.post(`voting-results-set/${eventId}`)
  }

  public getVotingResults(eventId: string): Promise<VotingResultsByCategory[]> {
    return this.get<VotingResultsByCategoryResponse[]>(`voting-results-get-by-event/${eventId}`)
      .then(({ data }) => mapper.map('VotingResultsByCategoryResponse', data, 'VotingResultsByCategory'))
  }

  public getRecentPlacements(): Promise<VotingResultByEventAndCategory[]> {
    return this.get<VotingResultByEventAndCategoryResponse[]>('voting-results-get-recent-events', { headers: composeAuthHeaders() })
      .then(({ data }) => mapper.map('VotingResultByEventAndCategoryResponse', data, 'VotingResultByEventAndCategory'))
  }

  public getBestPlacementsCounts(userId: string): Promise<VotingResultsCount[]> {
    return this.get<VotingResultsCount[]>(`voting-results-get-counts-by-place/${userId}`)
      .then(({ data }) => data)
  }
}
