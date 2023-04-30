import { Image, ImageResults } from '@/models'
import { ImageRequest, ImageResponse } from '@/models/api'
import { Api, mapper } from '@/services'

export class VehicleImagesApi extends Api {
  public async getVehicleImages(vehicleId: string, page = 1): Promise<ImageResults> {
    return await this.get<{
      images: ImageResponse[],
      hasMore: boolean,
    }>(`vehicles-images-get-list/${vehicleId}`).then(({ data }) => ({
      images: mapper.map('ImageResponse', data.images, 'Image'),
      hasMore: data.hasMore,
    }))
  }

  public async deleteVehicleImage(vehicleId: string, imageId: string): Promise<void> {
    return await this.delete(`vehicles-images-delete/${vehicleId}/${imageId}`)
  }

  public async createVehicleImage(vehicleId: string, request: ImageRequest): Promise<Image> {
    return await this.post(`vehicles-images-create/${vehicleId}`, request)
  }
}
