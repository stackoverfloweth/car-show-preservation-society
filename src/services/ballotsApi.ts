import { Ballot } from '@/models/ballot'
import { Api } from '@/services/api'
import { mocker } from '@/services/mocker'

export class BallotsApi extends Api {
  protected override routePrefix = '/ballots'

  public async getBallot(ballotId: string): Promise<Ballot | undefined> {
    return await Promise.resolve(mocker.create('ballot', [{ ballotId }]))
  }

  public async findBallots(eventId: string, userId: string): Promise<Ballot[]> {
    return await Promise.resolve(mocker.createMany('ballot', mocker.create('number', [1, 3])))
  }
}
