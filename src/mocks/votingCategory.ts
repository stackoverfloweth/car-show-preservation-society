import { VotingCategory } from '@/models/votingCategory'
import { MockFunction } from '@/services/mocker'
import { capitalize } from '@/utilities'

export const randomVotingCategory: MockFunction<VotingCategory, [Partial<VotingCategory>?]> = function(overrides) {
  const driversOnly = this.create('boolean')

  return new VotingCategory({
    votingCategoryId: this.create('id'),
    eventId: this.create('id'),
    name: `${this.create('number', [1, 9])}0's ${capitalize(this.create('noun'))}`,
    description: this.create('paragraph'),
    currentCapacity: this.create('number', [0, 10]),
    maxCapacity: this.create('boolean') ? this.create('number', [0, 10]) : undefined,
    driversOnly: driversOnly,
    membersOnly: !driversOnly && this.create('boolean'),
    stripePriceId: this.create('boolean') ? this.create('id') : undefined,
    ...overrides,
  })
}