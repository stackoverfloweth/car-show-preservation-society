import { Image } from '@/models'
import { ImageResponse } from '@/models/api'
import { MapFunction } from '@/services/mapper'

export const mapImageResponseToImage: MapFunction<ImageResponse, Image> = function(source) {
  return new Image({
    imageId: source._id.toString(),
    cloudinaryId: source.cloudinaryId,
    version: source.version,
    width: source.width,
    height: source.height,
    format: source.format,
    resource: source.resource,
    bytes: source.bytes,
    type: source.type,
    size: source.size,
    position: source.position,
    caption: source.caption,
  })
}