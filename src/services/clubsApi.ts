import { Image } from '@/models'
import { ClubRequest, ClubsFilter, ClubsSort, ImageRequest } from '@/models/api'
import { Club, IClub } from '@/models/club'
import { Api, mocker } from '@/services'

export class ClubsApi extends Api {
  protected override routePrefix = '/clubs'

  public async getClubs(filter?: ClubsFilter, sort?: ClubsSort): Promise<Club[]> {
    return await Promise.resolve(mocker.createMany('club', 5))
  }

  public async getUpcomingEventsCount(clubId: string): Promise<number> {
    return await Promise.resolve(mocker.create('number', [0, 50]))
  }

  public async getClub(clubId: string): Promise<Club | undefined> {
    return await Promise.resolve(mocker.create('club', [{ clubId }]))
  }

  public async createClub(request: ClubRequest): Promise<Club> {
    return await Promise.resolve(mocker.create('club', [request]))
  }

  public async updateClub(club: IClub): Promise<Club> {
    return await Promise.resolve(mocker.create('club', [club]))
  }

  public async deleteClubImage(imageId: string): Promise<void> {
    await Promise.resolve(imageId)
  }

  public async createClubImage(request: ImageRequest): Promise<Image> {
    return await Promise.resolve(mocker.create('image', [request]))
  }
}
