import { WithId } from 'mongodb'
import { Club, IClub } from '@/models'
import { ClubRequest, ClubsFilter, ClubsSort } from '@/models/api'
import { Api, mocker } from '@/services'

export class ClubsApi extends Api {
  public getClubs(filter?: ClubsFilter, sort?: ClubsSort): Promise<Club[]> {
    return this.get<WithId<IClub>[]>('clubs-get-list')
      .then(({ data }) => data.map(club => new Club(club)))
  }

  public async getUpcomingEventsCount(clubId: string): Promise<number> {
    return await Promise.resolve(mocker.create('number', [0, 50]))
  }

  public getClub(clubId: string): Promise<Club | undefined> {
    return this.get<WithId<IClub> | undefined>(`clubs-get-by-id/${clubId}`)
      .then(({ data }) => data ? new Club(data) : undefined)
  }

  public createClub(request: ClubRequest): Promise<string> {
    return this.post<string>('clubs-create', request)
      .then(({ data }) => data)
  }

  public updateClub(request: ClubRequest): Promise<void> {
    return this.put(`clubs-update/${request.clubId}`, request)
  }

  public deleteClub(clubId: string): Promise<void> {
    return this.delete(`clubs-delete/${clubId}`)
  }
}
