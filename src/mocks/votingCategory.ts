import { VotingCategory } from '@/models/votingCategory'
import { MockFunction } from '@/services/mocker'

export const randomVotingCategory: MockFunction<VotingCategory, []> = function() {
  const driversOnly = this.create('boolean')

  return {
    votingCategoryId: this.create('id'),
    eventId: this.create('id'),
    name: this.create('noun'),
    description: this.create('sentence'),
    maxCapacity: this.create('boolean') ? this.create('number') : undefined,
    driversOnly: driversOnly,
    membersOnly: !driversOnly,
  }
}