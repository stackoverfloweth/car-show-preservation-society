import { Advertisement } from '@/models/advertisement'
import { AdvertisementRequest, AdvertisementResponse } from '@/models/api'
import { Api, mapper } from '@/services'

export class AdvertisementsApi extends Api {
  public getAdvertisementsForEvent(eventId: string): Promise<Advertisement[]> {
    return this.get<AdvertisementResponse[]>(`sponsors-get-list-by-event/${eventId}`)
      .then(({ data }) => mapper.map('AdvertisementResponse', data, 'Advertisement'))
  }

  public getAdvertisementsForClub(clubId: string): Promise<Advertisement[]> {
    return this.get<AdvertisementResponse[]>(`sponsors-get-list-by-club/${clubId}`)
      .then(({ data }) => mapper.map('AdvertisementResponse', data, 'Advertisement'))
  }

  public createAdvertisement(request: AdvertisementRequest): Promise<string> {
    return this.post<string>('sponsors-create', request)
      .then(({ data }) => data)
  }

  public deleteAdvertisement(advertisementId: string): Promise<void> {
    return this.delete(`sponsors-delete/${advertisementId}`)
  }
}
