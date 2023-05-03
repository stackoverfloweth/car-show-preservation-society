import { VotingResult } from '@/models'
import { VotingResultResponse } from '@/models/api'
import { MapFunction } from '@/services/mapper'

export const mapVotingResultsResponseToVotingResult: MapFunction<VotingResultResponse, VotingResult> = function(source) {
  return {
    votingResultId: source._id.toString(),
    eventId: source.eventId,
    votingCategoryId: source.votingCategoryId,
    registration: this.map('RegistrationResponse', source.registration, 'Registration'),
    place: source.place,
    placeNumber: source.placeNumber,
  }
}