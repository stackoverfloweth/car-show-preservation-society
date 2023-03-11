import { Club } from '@/models/club'
import { Api } from '@/services/api'
import { mocker } from '@/services/mocker'

export class ClubsApi extends Api {
  protected override routePrefix = '/clubs'

  public async getClubs(): Promise<Club[]> {
    return await Promise.resolve(mocker.createMany('club', 5))
  }
}
