import { VotingCategoryRegistration } from '@/models/votingCategoryRegistration'
import { MockFunction } from '@/services/mocker'

export const randomVotingCategoryRegistration: MockFunction<VotingCategoryRegistration, []> = function() {
  return {
    votingCategoryRegistrationId: this.create('id'),
    votingCategoryId: this.create('id'),
    registrationId: this.create('id'),
  }
}