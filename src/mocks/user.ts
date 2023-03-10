import { User } from '@/models/user'
import { MockFunction } from '@/services/mocker'

export const randomUser: MockFunction<User, []> = function() {
  return {
    userId: this.create('id'),
    emailAddress: this.create('email'),
    phoneNumber: this.create('number').toString(),
    firstName: this.create('noun'),
    lastName: this.create('noun'),
    location: this.create('location'),
    profileImage: this.create('url'),
    stripeCustomerId: undefined,
  }
}