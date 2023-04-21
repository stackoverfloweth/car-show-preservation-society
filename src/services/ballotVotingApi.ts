import { Registration, User, Vehicle } from '@/models'
import { VoteRequest } from '@/models/api'
import { Api, mocker } from '@/services'

type BallotVotingCategoryData = {
  registration: Registration,
  vehicle: Vehicle,
  user: User,
}

export class BallotVotingApi extends Api {
  protected override routePrefix = '/ballot-voting'

  public async getBallotVotingCategoryData(votingCategoryId: string): Promise<BallotVotingCategoryData[]> {
    return await Promise.resolve(mocker.createMany('registration', 50).map(registration => ({
      registration,
      vehicle: mocker.create('vehicle', [{ vehicleId: registration.vehicleId }]),
      user: mocker.create('user', [{ userId: registration.userId }]),
    })))
  }

  public async setVotes(requests: VoteRequest[]): Promise<void> {
    await Promise.resolve({ requests })
  }
}
