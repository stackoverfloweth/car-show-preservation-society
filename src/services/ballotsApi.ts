import { BallotResponse } from '@/models/api'
import { Ballot } from '@/models/ballot'
import { Api } from '@/services/api'
import { mapper } from '@/services/mapper'

export class BallotsApi extends Api {
  public getBallot(eventId: string, ballotId: string): Promise<Ballot | undefined> {
    return this.get<BallotResponse | undefined>(`ballots-get-by-id/${eventId}/${ballotId}`)
      .then(({ data }) => mapper.map('BallotResponse', data, 'Ballot'))
  }

  public findBallots(eventId: string, userId: string): Promise<Ballot[]> {
    return this.get<BallotResponse[]>(`ballots-get-by-event-and-user/${eventId}/${userId}`)
      .then(({ data }) => mapper.map('BallotResponse', data, 'Ballot'))
  }
}
