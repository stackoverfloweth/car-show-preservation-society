import { Advertisement } from '@/models/advertisement'
import { AdvertisementRequest } from '@/models/api'
import { Api, mocker } from '@/services'

export class AdvertisementsApi extends Api {
  protected override routePrefix = '/advertisements'

  public async getAdvertisementsForEvent(eventId: string): Promise<Advertisement[]> {
    return await Promise.resolve(mocker.createMany('advertisement', 5))
  }

  public async getAdvertisementsForClub(clubId: string): Promise<Advertisement[]> {
    return await Promise.resolve(mocker.createMany('advertisement', 5))
  }

  public async createAdvertisement(request: AdvertisementRequest): Promise<Advertisement> {
    return await Promise.resolve(mocker.create('advertisement', [request]))
  }

  public async deleteAdvertisement(advertisementId: string): Promise<void> {
    await Promise.resolve(advertisementId)
  }
}
