import { Ballot } from '@/models/ballot'
import { Api } from '@/services/api'
import { mocker } from '@/services/mocker'

export class BallotsApi extends Api {
  protected override routePrefix = '/ballots'

  public async getBallot(ballotId: string): Promise<Ballot | undefined> {
    return await Promise.resolve(mocker.create('ballot', [1, { ballotId }]))
  }

  public async findBallots(eventId: string, userId: string): Promise<Ballot[]> {
    // this function will return theoretical ballots alongside existing ballots.
    // remember that as a club member I might have ballots for membersOnly like drivers have driversOnly
    const ballots: Ballot[] = []

    for (let index = 0; index < mocker.create('number', [1, 3]); index++) {
      ballots.push(mocker.create('ballot', [index + 1]))
    }

    return await Promise.resolve(ballots)
  }
}
