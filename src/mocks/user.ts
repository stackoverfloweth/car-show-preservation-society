import { User } from '@/models/user'
import { MockFunction } from '@/services/mocker'
import { capitalize } from '@/utilities'

export const randomUser: MockFunction<User, [Partial<User>?]> = function(overrides) {
  return new User({
    userId: this.create('id').toString(),
    emailAddress: this.create('email'),
    phoneNumber: this.create('phone'),
    firstName: capitalize(this.create('adjective')),
    lastName: capitalize(this.create('noun')),
    location: this.create('location'),
    profileImage: this.create('image'),
    stripeCustomerId: undefined,
    ...overrides,
  })
}