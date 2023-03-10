import { randomBoolean } from '@/mocks/boolean'
import { randomDate } from '@/mocks/date'
import { randomEmail } from '@/mocks/email'
import { randomId } from '@/mocks/id'
import { randomNumber } from '@/mocks/number'
import { randomChar, randomNoun, randomString, randomSentence, randomParagraph } from '@/mocks/string'
import { mocks as stripeMocks } from '@/mocks/stripe'
import { randomUrl } from '@/mocks/url'

export const mocks = {
  boolean: randomBoolean,
  char: randomChar,
  date: randomDate,
  email: randomEmail,
  id: randomId,
  noun: randomNoun,
  number: randomNumber,
  paragraph: randomParagraph,
  sentence: randomSentence,
  string: randomString,
  url: randomUrl,
  ...stripeMocks,
}