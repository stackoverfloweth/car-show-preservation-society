import { Image, ImageResults } from '@/models'
import { ImageRequest, ImageResponse } from '@/models/api'
import { Api, mapper } from '@/services'

export class ClubImagesApi extends Api {
  public async getClubImages(clubId: string, page = 1): Promise<ImageResults> {
    return await this.get<{
      images: ImageResponse[],
      hasMore: boolean,
    }>(`clubs-images-get-list/${clubId}`).then(({ data }) => ({
      images: mapper.map('ImageResponse', data.images, 'Image'),
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
