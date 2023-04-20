import { VotingCategory } from '@/models/votingCategory'
import { MockFunction } from '@/services/mocker'

export const randomVotingCategory: MockFunction<VotingCategory, [Partial<VotingCategory>?]> = function(overrides) {
  const driversOnly = this.create('boolean')

  return new VotingCategory({
    votingCategoryId: this.create('id'),
    eventId: this.create('id'),
    name: this.create('noun'),
    description: this.create('sentence'),
    currentCapacity: this.create('number', [0, 10]),
    maxCapacity: this.create('boolean') ? this.create('number', [0, 10]) : undefined,
    driversOnly: driversOnly,
    membersOnly: !driversOnly && this.create('boolean'),
    stripePriceId: this.create('boolean') ? this.create('id') : undefined,
    ...overrides,
  })
}