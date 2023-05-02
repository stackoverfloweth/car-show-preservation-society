import { VotingResultsCount, VotingResultsByCategory, VotingResultsByEventAndCategory } from '@/models'
import { VoteRequest } from '@/models/api'
import { Api, mocker } from '@/services'

export class VotingApi extends Api {
  public setVotes(requests: VoteRequest[]): Promise<void> {
    return Promise.resolve()
  }

  public getVotingResults(eventId: string): Promise<VotingResultsByCategory[]> {
    return Promise.resolve([
      ...mocker.createMany('votingCategory', mocker.create('number', [1, 3]), [{ featured: true }]).map(votingCategory => mocker.create('votingResultsByCategory', [{ votingCategory }])),
      ...mocker.createMany('votingResultsByCategory', mocker.create('number', [3, 10])),
    ])
  }

  public getRecentPlacements(userId: string, vehicleId?: string): Promise<VotingResultsByEventAndCategory[]> {
    if (mocker.create('boolean')) {
      return Promise.resolve([])
    }

    return Promise.resolve(mocker.createMany('votingResultsByEventAndCategory', mocker.create('number', [0, 4])))
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
