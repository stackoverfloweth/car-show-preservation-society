import { User as GoTrueUser } from 'gotrue-js'
import { User } from '@/models'
import { UserAttributes } from '@/models/api'
import { MapFunction } from '@/services/mapper'

export const mapGoTrueUserToUser: MapFunction<GoTrueUser, User> = function(source) {
  return new User({
    userId: source.id,
    emailAddress: source.email,
    phoneNumber: source.user_metadata.phoneNumber,
    firstName: source.user_metadata.firstName,
    lastName: source.user_metadata.lastName,
    location: source.user_metadata.location,
    stripeCustomerId: source.user_metadata.stripeCustomerId,
    hideEmailAddress: source.user_metadata.hideEmailAddress,
    hidePhoneNumber: source.user_metadata.hidePhoneNumber,
    hideLocation: source.user_metadata.hideLocation,
    displayNameOverride: source.user_metadata.displayNameOverride,
  })
}

export const mapUserToUserAttributes: MapFunction<User, UserAttributes> = function(source) {
  return {
    phoneNumber: source.phoneNumber,
    firstName: source.firstName,
    lastName: source.lastName,
    location: source.location,
    stripeCustomerId: source.stripeCustomerId,
    hideEmailAddress: source.hideEmailAddress,
    hidePhoneNumber: source.hidePhoneNumber,
    hideLocation: source.hideLocation,
    displayNameOverride: source.displayNameOverride,
  }
}