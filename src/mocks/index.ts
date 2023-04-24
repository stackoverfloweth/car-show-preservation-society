import { randomAdvertisement } from '@/mocks/advertisement'
import { randomBallot } from '@/mocks/ballot'
import { randomBallotVotingCategory } from '@/mocks/ballotVotingCategory'
import { randomBoolean } from '@/mocks/boolean'
import { randomCarId } from '@/mocks/carId'
import { randomClub } from '@/mocks/club'
import { randomClubMembership } from '@/mocks/clubMembership'
import { randomClubSubscription } from '@/mocks/clubSubscription'
import { randomDate } from '@/mocks/date'
import { randomEmail } from '@/mocks/email'
import { randomEvent } from '@/mocks/event'
import { randomId } from '@/mocks/id'
import { randomImage } from '@/mocks/image'
import { randomImageResults } from '@/mocks/imageResults'
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
import { randomVotingResult } from '@/mocks/votingResult'
import { randomVotingResultsByCategory } from '@/mocks/votingResultByCategory'

export const mocks = {
  adjective: randomAdjective,
  advertisement: randomAdvertisement,
  ballot: randomBallot,
  ballotVotingCategory: randomBallotVotingCategory,
  boolean: randomBoolean,
  carId: randomCarId,
  char: randomChar,
  club: randomClub,
  clubMembership: randomClubMembership,
  clubSubscription: randomClubSubscription,
  date: randomDate,
  email: randomEmail,
  event: randomEvent,
  id: randomId,
  image: randomImage,
  imageResults: randomImageResults,
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
  votingResult: randomVotingResult,
  votingResultsByCategory: randomVotingResultsByCategory,
  ...stripeMocks,
}