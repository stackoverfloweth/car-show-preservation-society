import { WithId } from 'mongodb'
import { Image } from '@/models'
import { ClubRequest, ClubsFilter, ClubsSort, ImageRequest } from '@/models/api'
import { Club, IClub } from '@/models/club'
import { Api, mocker } from '@/services'

export class ClubsApi extends Api {
  protected override routePrefix = '/.netlify/functions/clubs'

  public async getClubs(filter?: ClubsFilter, sort?: ClubsSort): Promise<Club[]> {
    return await this.get<WithId<IClub>[]>()
      .then(({ data }) => data.map(club => new Club({ ...club, clubId: club._id.toString() })))
  }

  public async getUpcomingEventsCount(clubId: string): Promise<number> {
    return await Promise.resolve(mocker.create('number', [0, 50]))
  }

  public async getClub(clubId: string): Promise<Club | undefined> {
    return await this.get<WithId<IClub> | undefined>(`/${clubId}`)
      .then(({ data }) => data ? new Club({ ...data, clubId: data._id.toString() }) : undefined)
  }

  public async createClub(request: ClubRequest): Promise<string> {
    return await this.post<string>(undefined, request)
      .then(({ data }) => data)
  }

  public async updateClub(club: ClubRequest): Promise<void> {
    await this.put(`/${club.clubId}`, club)
  }

  public async deleteClub(clubId: string): Promise<void> {
    return await this.delete(`/${clubId}`)
  }

  public async deleteClubImage(imageId: string): Promise<void> {
    await Promise.resolve({ imageId })
  }

  public async createClubImage(request: ImageRequest): Promise<Image> {
    return await Promise.resolve(mocker.create('image', [request]))
  }
}
