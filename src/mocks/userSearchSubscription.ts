import { UserSearchSubscription } from '@/models/userSearchSubscription'
import { MockFunction } from '@/services/mocker'

export const randomUserSearchSubscription: MockFunction<UserSearchSubscription, [Partial<UserSearchSubscription>?]> = function(overrides) {
  return {
    userSearchSubscriptionId: this.create('id'),
    userId: this.create('id'),
    ...overrides,
  }
}