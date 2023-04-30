import { mapAdvertisementResponseToAdvertisement } from '@/maps/advertisement'
import { mapClubResponseToClub } from '@/maps/club'
import { mapDateToString, mapStringToDate } from '@/maps/date'
import { mapEventResponseToEvent, mapEventToEventRequest } from '@/maps/event'
import { mapImageResponseToImage } from '@/maps/image'
import { mapMapBoxFeatureResponseToLocation } from '@/maps/location'
import { mapRegistrationToRegistrationRequest } from '@/maps/registrationRequest'
import { mapVehicleResponseToVehicle, mapVehicleToVehicleRequest } from '@/maps/vehicle'
import { mapVotingCategoryResponseToVotingCategory } from '@/maps/votingCategory'

export const maps = {
  AdvertisementResponse: { Advertisement: mapAdvertisementResponseToAdvertisement },
  ClubResponse: { Club: mapClubResponseToClub },
  Date: { String: mapDateToString },
  Event: { EventRequest: mapEventToEventRequest },
  EventResponse: { Event: mapEventResponseToEvent },
  ImageResponse: { Image: mapImageResponseToImage },
  MapBoxFeatureResponse: { Location: mapMapBoxFeatureResponseToLocation },
  Registration: { RegistrationRequest: mapRegistrationToRegistrationRequest },
  String: { Date: mapStringToDate },
  VehicleResponse: { Vehicle: mapVehicleResponseToVehicle },
  Vehicle: { VehicleRequest: mapVehicleToVehicleRequest },
  VotingCategoryResponse: { VotingCategory: mapVotingCategoryResponseToVotingCategory },
}