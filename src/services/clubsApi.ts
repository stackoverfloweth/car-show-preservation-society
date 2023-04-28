import { WithId } from 'mongodb'
import { ClubRequest, ClubsFilter, ClubsSort } from '@/models/api'
import { Club, IClub } from '@/models/club'
import { Api, mocker } from '@/services'

export class ClubsApi extends Api {
  public async getClubs(filter?: ClubsFilter, sort?: ClubsSort): Promise<Club[]> {
    return await this.get<WithId<IClub>[]>('clubs-get-list')
      .then(({ data }) => data.map(club => new Club(club)))
  }

  public async getUpcomingEventsCount(clubId: string): Promise<number> {
    return await Promise.resolve(mocker.create('number', [0, 50]))
  }

  public async getClub(clubId: string): Promise<Club | undefined> {
    return await this.get<WithId<IClub> | undefined>(`clubs-get-by-id/${clubId}`)
      .then(({ data }) => data ? new Club(data) : undefined)
  }

  public async createClub(request: ClubRequest): Promise<string> {
    return await this.post<string>('clubs-create', request)
      .then(({ data }) => data)
  }

  public async updateClub(club: ClubRequest): Promise<void> {
    await this.put(`clubs-update/${club.clubId}`, club)
  }

  public async deleteClub(clubId: string): Promise<void> {
    return await this.delete(`clubs-delete/${clubId}`)
  }
}
