import { VotingCategoryRegistration } from '@/models/votingCategoryRegistration'
import { MockFunction } from '@/services/mocker'

export const randomVotingCategoryRegistration: MockFunction<VotingCategoryRegistration, [Partial<VotingCategoryRegistration>?]> = function(overrides) {
  return {
    votingCategoryRegistrationId: this.create('id'),
    votingCategoryId: this.create('id'),
    registrationId: this.create('id'),
    ...overrides,
  }
}