import { VotingResultsCount, VotingResultsByCategory, VotingResultByEventAndCategory } from '@/models'
import { VotingResultByEventAndCategoryResponse, VotingResultsByCategoryResponse } from '@/models/api'
import { Api, mapper, mocker } from '@/services'

export class VotingResultsApi extends Api {
  public getVotingResults(eventId: string): Promise<VotingResultsByCategory[]> {
    return this.get<VotingResultsByCategoryResponse[]>(`voting-results-get-by-event/${eventId}`)
      .then(({ data }) => mapper.map('VotingResultsByCategoryResponse', data, 'VotingResultsByCategory'))
  }

  public getRecentPlacements(userId: string): Promise<VotingResultByEventAndCategory[]> {
    return this.get<VotingResultByEventAndCategoryResponse[]>(`voting-results-get-recent-events-by-user/${userId}`)
      .then(({ data }) => mapper.map('VotingResultByEventAndCategoryResponse', data, 'VotingResultByEventAndCategory'))
  }

  public getBestPlacementsCounts(userId: string): Promise<VotingResultsCount[]> {
    const value: VotingResultsCount[] = []
    if (mocker.create('boolean')) {
      value.push(mocker.create('votingResultsCount', [{ placeNumber: 1 }]))
    }

    if (mocker.create('boolean')) {
      value.push(mocker.create('votingResultsCount', [{ placeNumber: 2 }]))
    }

    if (mocker.create('boolean')) {
      value.push(mocker.create('votingResultsCount', [{ placeNumber: 3 }]))
    }

    return Promise.resolve(value)
  }
}
