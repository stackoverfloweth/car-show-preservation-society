import { VotingResultsByCategory, VotingResultsByEventAndCategory } from '@/models'
import { VoteRequest } from '@/models/api'
import { Api, mocker } from '@/services'

export class VotingApi extends Api {
  protected override routePrefix = '/ballot-voting'

  public async setVotes(requests: VoteRequest[]): Promise<void> {
    await Promise.resolve({ requests })
  }

  public async getVotingResults(eventId: string): Promise<VotingResultsByCategory[]> {
    return await Promise.resolve([
      ...mocker.createMany('votingCategory', mocker.create('number', [1, 3]), [{ featured: true }]).map(votingCategory => mocker.create('votingResultsByCategory', [{ votingCategory }])),
      ...mocker.createMany('votingResultsByCategory', mocker.create('number', [3, 10])),
    ])
  }

  public async getRecentPlacements(userId: string, vehicleId?: string): Promise<VotingResultsByEventAndCategory[]> {
    if (mocker.create('boolean')) {
      return []
    }

    return await Promise.resolve(mocker.createMany('votingResultsByEventAndCategory', mocker.create('number', [0, 4])))
  }
}
