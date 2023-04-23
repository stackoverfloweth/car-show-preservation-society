import { mapMapBoxFeatureResponseToLocation } from '@/maps/location'
import { mapRegistrationToRegistrationRequest } from '@/maps/registrationRequest'

export const maps = {
  MapBoxFeatureResponse: { Location: mapMapBoxFeatureResponseToLocation },
  Registration: { RegistrationRequest: mapRegistrationToRegistrationRequest },
}