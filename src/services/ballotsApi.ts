import { BallotResponse, VoteRequest } from '@/models/api'
import { Ballot } from '@/models/ballot'
import { Api } from '@/services/api'
import { composeAuthHeaders } from '@/services/auth'
import { mapper } from '@/services/mapper'

export class BallotsApi extends Api {
  public setVotes(ballotId: string, requests: VoteRequest[]): Promise<void> {
    return this.post(`ballots-set-votes/${ballotId}`, requests)
  }

  public getBallot(eventId: string, ballotId: string): Promise<Ballot | undefined> {
    return this.get<BallotResponse | undefined>(`ballots-get-by-id/${eventId}/${ballotId}`)
      .then(({ data }) => mapper.map('BallotResponse', data, 'Ballot'))
  }

  public findCurrentUserBallots(eventId: string): Promise<Ballot[]> {
    return this.get<BallotResponse[]>(`ballots-get-by-token-and-event/${eventId}`, { headers: composeAuthHeaders() })
      .then(({ data }) => mapper.map('BallotResponse', data, 'Ballot'))
  }
}
