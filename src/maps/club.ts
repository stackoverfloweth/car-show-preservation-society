import { Club } from '@/models'
import { ClubResponse } from '@/models/api'
import { MapFunction } from '@/services/mapper'

export const mapClubResponseToClub: MapFunction<ClubResponse, Club> = function(source) {
  return new Club({
    clubId: source._id.toString(),
    name: source.name,
    description: source.description,
    contactUserId: source.contactUserId,
    stripeCustomerId: source.stripeCustomerId,
    image: this.map('ImageResponse', source.image, 'Image'),
    joinableByAnyone: source.joinableByAnyone,
    joinableByApplication: source.joinableByApplication,
    images: source.images ? this.map('ImageResponse', source.images, 'Image') : [],
  })
}