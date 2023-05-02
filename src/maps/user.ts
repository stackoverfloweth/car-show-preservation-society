import { User } from '@/models'
import { UserRequest, UserResponse } from '@/models/api'
import { MapFunction } from '@/services/mapper'

export const mapUserResponseToUser: MapFunction<UserResponse, User> = function(source) {
  return new User({
    userId: source._id.toString(),
    emailAddress: source.emailAddress,
    phoneNumber: source.phoneNumber,
    firstName: source.firstName,
    lastName: source.lastName,
    location: source.location,
    image: this.map('ImageResponse', source.image, 'Image'),
    stripeCustomerId: source.stripeCustomerId,
    hideEmailAddress: source.hideEmailAddress,
    hidePhoneNumber: source.hidePhoneNumber,
    hideLocation: source.hideLocation,
    displayNameOverride: source.displayNameOverride,
  })
}

export const mapUserToUserRequest: MapFunction<User, UserRequest> = function(source) {
  return {
    userId: source.userId,
    emailAddress: source.emailAddress,
    phoneNumber: source.phoneNumber,
    firstName: source.firstName,
    lastName: source.lastName,
    location: source.location,
    image: undefined,
    stripeCustomerId: source.stripeCustomerId,
    hideEmailAddress: source.hideEmailAddress,
    hidePhoneNumber: source.hidePhoneNumber,
    hideLocation: source.hideLocation,
    displayNameOverride: source.displayNameOverride,
  }
}