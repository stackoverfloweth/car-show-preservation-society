import { IImage, Image, ImageResults } from '@/models'
import { ImageRequest } from '@/models/api'
import { Api } from '@/services'

export class EventImagesApi extends Api {
  public async getEventImages(eventId: string, page = 1): Promise<ImageResults> {
    return await this.get<{
      images: IImage[],
      hasMore: boolean,
    }>(`events-images-get-list/${eventId}`).then(({ data }) => ({
      images: data.images.map(image => new Image(image)),
      hasMore: data.hasMore,
    }))

  }

  public async deleteEventImage(imageId: string): Promise<void> {
    return await this.delete(`events-images-delete/${imageId}`)
  }

  public async createEventImage(eventId: string, request: ImageRequest): Promise<Image> {
    return await this.post(`events-images-create/${eventId}`, request)
  }
}
