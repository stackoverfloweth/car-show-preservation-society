import { Advertisement } from '@/models'
import { AdvertisementResponse } from '@/models/api'
import { MapFunction } from '@/services/mapper'

export const mapAdvertisementResponseToAdvertisement: MapFunction<AdvertisementResponse, Advertisement> = function(source) {
  return {
    advertisementId: source._id.toString(),
    image: this.map('ImageResponse', source.image, 'Image'),
    title: source.title,
    description: source.description,
    href: source.href,
    size: source.size,
  }
}