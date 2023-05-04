import { ClubApplication } from '@/models'
import { ClubApplicationResponse } from '@/models/api'
import { MapFunction } from '@/services/mapper'

export const mapClubApplicationResponseToClubApplication: MapFunction<ClubApplicationResponse, ClubApplication> = function(source) {
  return {
    clubApplicationId: source._id.toString(),
    clubId: source.clubId,
    userId: source.userId,
    message: source.message,
  }
}