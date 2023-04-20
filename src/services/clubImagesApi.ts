import { Image } from '@/models'
import { ImageRequest } from '@/models/api'
import { Api, mocker } from '@/services'

export class ClubImagesApi extends Api {
  protected override routePrefix = '/club-images'

  public async getClubImages(clubId: string): Promise<Image[]> {
    return await Promise.resolve(mocker.createMany('image', mocker.create('number', [0, 50])))
  }

  public async deleteClubImage(imageId: string): Promise<void> {
    await Promise.resolve(imageId)
  }

  public async createClubImage(request: ImageRequest): Promise<Image> {
    return await Promise.resolve(mocker.create('image', [request]))
  }
}