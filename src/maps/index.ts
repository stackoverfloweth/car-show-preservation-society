import { mapAdvertisementResponseToAdvertisement } from '@/maps/advertisement'
import { mapBallotResponseToBallot } from '@/maps/ballot'
import { mapBallotVotingCategoryResponseToBallotVotingCategory } from '@/maps/ballotVotingCategory'
import { mapClubResponseToClub } from '@/maps/club'
import { mapDateToString, mapStringToDate } from '@/maps/date'
import { mapEventResponseToEvent, mapEventToEventRequest } from '@/maps/event'
import { mapImageResponseToImage } from '@/maps/image'
import { mapMapBoxFeatureResponseToLocation } from '@/maps/location'
import { mapRegistrationResponseToRegistration, mapRegistrationToRegistrationRequest } from '@/maps/registration'
import { mapUserResponseToUser, mapUserToUserRequest } from '@/maps/user'
import { mapVehicleResponseToVehicle, mapVehicleToVehicleRequest } from '@/maps/vehicle'
import { mapVotingCategoryResponseToVotingCategory } from '@/maps/votingCategory'
import { mapVotingResultsResponseToVotingResult } from '@/maps/votingResult'
import { mapVotingResultByEventAndCategoryResponseToVotingResultByEventAndCategory } from '@/maps/votingResultByEventAndCategory'
import { mapVotingResultsByCategoryResponseToVotingResultsByCategory } from '@/maps/votingResultsByCategory'

export const maps = {
  AdvertisementResponse: { Advertisement: mapAdvertisementResponseToAdvertisement },
  BallotResponse: { Ballot: mapBallotResponseToBallot },
  BallotVotingCategoryResponse: { BallotVotingCategory: mapBallotVotingCategoryResponseToBallotVotingCategory },
  ClubResponse: { Club: mapClubResponseToClub },
  Date: { String: mapDateToString },
  Event: { EventRequest: mapEventToEventRequest },
  EventResponse: { Event: mapEventResponseToEvent },
  ImageResponse: { Image: mapImageResponseToImage },
  MapBoxFeatureResponse: { Location: mapMapBoxFeatureResponseToLocation },
  Registration: { RegistrationRequest: mapRegistrationToRegistrationRequest },
  RegistrationResponse: { Registration: mapRegistrationResponseToRegistration },
  String: { Date: mapStringToDate },
  User: { UserRequest: mapUserToUserRequest },
  UserResponse: { User: mapUserResponseToUser },
  Vehicle: { VehicleRequest: mapVehicleToVehicleRequest },
  VehicleResponse: { Vehicle: mapVehicleResponseToVehicle },
  VotingCategoryResponse: { VotingCategory: mapVotingCategoryResponseToVotingCategory },
  VotingResultResponse: { VotingResult: mapVotingResultsResponseToVotingResult },
  VotingResultsByCategoryResponse: { VotingResultsByCategory: mapVotingResultsByCategoryResponseToVotingResultsByCategory },
  VotingResultByEventAndCategoryResponse: { VotingResultByEventAndCategory: mapVotingResultByEventAndCategoryResponseToVotingResultByEventAndCategory },
}