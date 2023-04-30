import { Image, ImageResults } from '@/models'
import { ImageRequest, ImageResponse } from '@/models/api'
import { Api, mapper } from '@/services'

export class EventImagesApi extends Api {
  public async getEventImages(eventId: string, page = 1): Promise<ImageResults> {
    return await this.get<{
      images: ImageResponse[],
      hasMore: boolean,
    }>(`events-images-get-list/${eventId}`).then(({ data }) => ({
      images: mapper.map('ImageResponse', data.images, 'Image'),
      hasMore: data.hasMore,
    }))
  }

  public async deleteEventImage(eventId: string, imageId: string): Promise<void> {
    return await this.delete(`events-images-delete/${eventId}/${imageId}`)
  }

  public async createEventImage(eventId: string, request: ImageRequest): Promise<Image> {
    return await this.post(`events-images-create/${eventId}`, request)
  }
}
