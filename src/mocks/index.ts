import { randomAdvertisement } from '@/mocks/advertisement'
import { randomBallot } from '@/mocks/ballot'
import { randomBallotVotingCategory } from '@/mocks/ballotVotingCategory'
import { randomBoolean } from '@/mocks/boolean'
import { randomClub } from '@/mocks/club'
import { randomClubMembership } from '@/mocks/clubMembership'
import { randomClubSubscription } from '@/mocks/clubSubscription'
import { randomDate } from '@/mocks/date'
import { randomEmail } from '@/mocks/email'
import { randomEvent } from '@/mocks/event'
import { randomEventImage } from '@/mocks/eventImage'
import { randomId } from '@/mocks/id'
import { randomImage } from '@/mocks/image'
import { randomLocation } from '@/mocks/location'
import { randomMessage } from '@/mocks/message'
import { randomNumber } from '@/mocks/number'
import { randomPhone } from '@/mocks/phone'
import { randomRegistration } from '@/mocks/registration'
import { randomChar, randomNoun, randomString, randomSentence, randomParagraph, randomAdjective } from '@/mocks/string'
import { mocks as stripeMocks } from '@/mocks/stripe'
import { randomUrl } from '@/mocks/url'
import { randomUser } from '@/mocks/user'
import { randomUserSearchSubscription } from '@/mocks/userSearchSubscription'
import { randomVehicle } from '@/mocks/vehicle'
import { randomVotingCategory } from '@/mocks/votingCategory'
import { randomVotingCategoryRegistration } from '@/mocks/votingCategoryRegistration'

export const mocks = {
  adjective: randomAdjective,
  advertisement: randomAdvertisement,
  ballot: randomBallot,
  ballotVotingCategory: randomBallotVotingCategory,
  boolean: randomBoolean,
  char: randomChar,
  club: randomClub,
  clubMembership: randomClubMembership,
  clubSubscription: randomClubSubscription,
  date: randomDate,
  email: randomEmail,
  event: randomEvent,
  eventImage: randomEventImage,
  id: randomId,
  image: randomImage,
  location: randomLocation,
  message: randomMessage,
  noun: randomNoun,
  number: randomNumber,
  paragraph: randomParagraph,
  phone: randomPhone,
  registration: randomRegistration,
  sentence: randomSentence,
  string: randomString,
  url: randomUrl,
  user: randomUser,
  userSearchSubscription: randomUserSearchSubscription,
  vehicle: randomVehicle,
  votingCategory: randomVotingCategory,
  votingCategoryRegistration: randomVotingCategoryRegistration,
  ...stripeMocks,
}