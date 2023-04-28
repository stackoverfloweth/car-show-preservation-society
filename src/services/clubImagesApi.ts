import { IImage, Image, ImageResults } from '@/models'
import { ImageRequest } from '@/models/api'
import { Api } from '@/services'

export class ClubImagesApi extends Api {
  public async getClubImages(clubId: string, page = 1): Promise<ImageResults> {
    return await this.get<{
      images: IImage[],
      hasMore: boolean,
    }>(`clubs-images-get-list/${clubId}`).then(({ data }) => ({
      images: data.images.map(image => new Image(image)),
      hasMore: data.hasMore,
    }))

  }

  public async deleteClubImage(imageId: string): Promise<void> {
    return await this.delete(`clubs-images-delete/${imageId}`)
  }

  public async createClubImage(clubId: string, request: ImageRequest): Promise<Image> {
    return await this.post(`clubs-images-create/${clubId}`, request)
  }
}
