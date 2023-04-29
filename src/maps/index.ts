import { mapClubResponseToClub } from '@/maps/club'
import { mapDateToString, mapStringToDate } from '@/maps/date'
import { mapImageResponseToImage } from '@/maps/image'
import { mapMapBoxFeatureResponseToLocation } from '@/maps/location'
import { mapRegistrationToRegistrationRequest } from '@/maps/registrationRequest'

export const maps = {
  ClubResponse: { Club: mapClubResponseToClub },
  Date: { String: mapDateToString },
  ImageResponse: { Image: mapImageResponseToImage },
  MapBoxFeatureResponse: { Location: mapMapBoxFeatureResponseToLocation },
  Registration: { RegistrationRequest: mapRegistrationToRegistrationRequest },
  String: { Date: mapStringToDate },
}