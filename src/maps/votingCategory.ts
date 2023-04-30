import { VotingCategory } from '@/models'
import { VotingCategoryResponse } from '@/models/api'
import { MapFunction } from '@/services/mapper'

export const mapVotingCategoryResponseToVotingCategory: MapFunction<VotingCategoryResponse, VotingCategory> = function(source) {
  return new VotingCategory({
    votingCategoryId: source._id.toString(),
    eventId: source.eventId,
    name: source.name,
    description: source.description,
    maxCapacity: source.maxCapacity,
    driversOnly: source.driversOnly,
    membersOnly: source.membersOnly,
    automaticEntry: source.automaticEntry,
    featured: source.featured,
    stripePriceId: source.stripePriceId,
    currentCapacity: source.currentCapacity,
  })
}