import { User } from '@/models/user'
import { MockFunction } from '@/services/mocker'

export const randomUser: MockFunction<User, [Partial<User>?]> = function(overrides) {
  return {
    userId: this.create('id'),
    emailAddress: this.create('email'),
    phoneNumber: this.create('phone'),
    firstName: this.create('adjective'),
    lastName: this.create('noun'),
    location: this.create('location'),
    profileImage: this.create('image'),
    stripeCustomerId: undefined,
    ...overrides,
  }
}