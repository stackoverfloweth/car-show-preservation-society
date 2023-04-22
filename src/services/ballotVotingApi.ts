import { VoteRequest } from '@/models/api'
import { Api } from '@/services'

export class BallotVotingApi extends Api {
  protected override routePrefix = '/ballot-voting'

  public async setVotes(requests: VoteRequest[]): Promise<void> {
    await Promise.resolve({ requests })
  }
}
