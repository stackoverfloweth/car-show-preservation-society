import { Club, ClubResponse } from '@/models'
import { ClubRequest, ClubsFilter, ClubsSort } from '@/models/api'
import { Api, mapper, mocker } from '@/services'

export class ClubsApi extends Api {
  public getClubs(filter?: ClubsFilter, sort?: ClubsSort): Promise<Club[]> {
    return this.get<ClubResponse[]>('clubs-get-list')
      .then(({ data }) => mapper.map('ClubResponse', data, 'Club'))
  }

  public async getUpcomingEventsCount(clubId: string): Promise<number> {
    return await Promise.resolve(mocker.create('number', [0, 50]))
  }

  public getClub(clubId: string): Promise<Club | undefined> {
    return this.get<ClubResponse | undefined>(`clubs-get-by-id/${clubId}`)
      .then(({ data }) => mapper.map('ClubResponse', data, 'Club'))
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
