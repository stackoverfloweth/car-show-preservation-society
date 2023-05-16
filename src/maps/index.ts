import { mapAdvertisementResponseToAdvertisement } from '@/maps/advertisement'
import { mapBallotResponseToBallot } from '@/maps/ballot'
import { mapBallotVotingCategoryResponseToBallotVotingCategory } from '@/maps/ballotVotingCategory'
import { mapClubResponseToClub } from '@/maps/club'
import { mapClubApplicationResponseToClubApplication } from '@/maps/clubApplication'
import { mapClubInviteResponseToClubInvite } from '@/maps/clubInvite'
import { mapClubMembershipResponseToClubMembership } from '@/maps/clubMembership'
import { mapDateToString, mapStringToDate } from '@/maps/date'
import { mapEventResponseToEvent, mapEventToEventRequest } from '@/maps/event'
import { mapImageResponseToImage } from '@/maps/image'
import { mapMapBoxFeatureResponseToLocation } from '@/maps/location'
import { mapRegistrationResponseToRegistration, mapRegistrationToRegistrationRequest } from '@/maps/registration'
import { mapGoTrueUserToUser, mapUserToUserAttributes } from '@/maps/user'
import { mapVehicleResponseToVehicle, mapVehicleToVehicleRequest } from '@/maps/vehicle'
import { mapVotingCategoryResponseToVotingCategory } from '@/maps/votingCategory'
import { mapVotingResultsResponseToVotingResult } from '@/maps/votingResult'
import { mapVotingResultByEventAndCategoryResponseToVotingResultByEventAndCategory } from '@/maps/votingResultByEventAndCategory'
import { mapVotingResultsByCategoryResponseToVotingResultsByCategory } from '@/maps/votingResultsByCategory'

export const maps = {
  AdvertisementResponse: { Advertisement: mapAdvertisementResponseToAdvertisement },
  BallotResponse: { Ballot: mapBallotResponseToBallot },
  BallotVotingCategoryResponse: { BallotVotingCategory: mapBallotVotingCategoryResponseToBallotVotingCategory },
  ClubApplicationResponse: { ClubApplication: mapClubApplicationResponseToClubApplication },
  ClubInviteResponse: { ClubInvite: mapClubInviteResponseToClubInvite },
  ClubMembershipResponse: { ClubMembership: mapClubMembershipResponseToClubMembership },
  ClubResponse: { Club: mapClubResponseToClub },
  Date: { String: mapDateToString },
  Event: { EventRequest: mapEventToEventRequest },
  EventResponse: { Event: mapEventResponseToEvent },
  ImageResponse: { Image: mapImageResponseToImage },
  MapBoxFeatureResponse: { Location: mapMapBoxFeatureResponseToLocation },
  Registration: { RegistrationRequest: mapRegistrationToRegistrationRequest },
  RegistrationResponse: { Registration: mapRegistrationResponseToRegistration },
  String: { Date: mapStringToDate },
  User: { UserAttributes: mapUserToUserAttributes },
  GoTrueUser: { User: mapGoTrueUserToUser },
  Vehicle: { VehicleRequest: mapVehicleToVehicleRequest },
  VehicleResponse: { Vehicle: mapVehicleResponseToVehicle },
  VotingCategoryResponse: { VotingCategory: mapVotingCategoryResponseToVotingCategory },
  VotingResultByEventAndCategoryResponse: { VotingResultByEventAndCategory: mapVotingResultByEventAndCategoryResponseToVotingResultByEventAndCategory },
  VotingResultResponse: { VotingResult: mapVotingResultsResponseToVotingResult },
  VotingResultsByCategoryResponse: { VotingResultsByCategory: mapVotingResultsByCategoryResponseToVotingResultsByCategory },
}