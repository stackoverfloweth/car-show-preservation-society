import { Handler } from '@netlify/functions'
import { HttpMethod } from '@/../netlify/types/httpMethod'

export type PatternHandler = (...args: string[]) => Handler

export type Pattern = {
  method: HttpMethod,
  path: RegExp,
  handler: PatternHandler,
}