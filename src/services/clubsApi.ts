import { ClubRequest } from '@/models/api'
import { Club } from '@/models/club'
import { Api, mocker } from '@/services'

export class ClubsApi extends Api {
  protected override routePrefix = '/clubs'

  public async getClubs(): Promise<Club[]> {
    return await Promise.resolve(mocker.createMany('club', 5))
  }

  public async getClub(clubId: string): Promise<Club | undefined> {
    return await Promise.resolve(mocker.create('club', [{ clubId }]))
  }

  public async createClub(request: ClubRequest): Promise<Club> {
    return await Promise.resolve(mocker.create('club', [request]))
  }

  public async joinClub(clubId: string, userId: string, message?: string): Promise<void> {
    await Promise.resolve({ clubId, userId, message })
  }
}
