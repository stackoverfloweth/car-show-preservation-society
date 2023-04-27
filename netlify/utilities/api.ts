import { Handler, HandlerResponse } from '@netlify/functions'
import { JsonOutput, Pattern, PatternHandler } from 'netlify/types'

export const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  'Content-Type': 'application/json',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Max-Age': '2592000',
  'Access-Control-Allow-Credentials': 'true',
}

export class Api {
  private readonly patterns: Pattern[] = []

  public get(path: string, handler: PatternHandler): void {
    this.patterns.push(new Pattern('GET', path, handler))
  }

  public put(path: string, handler: PatternHandler): void {
    this.patterns.push(new Pattern('PUT', path, handler))
  }

  public post(path: string, handler: PatternHandler): void {
    this.patterns.push(new Pattern('POST', path, handler))
  }

  public delete(path: string, handler: PatternHandler): void {
    this.patterns.push(new Pattern('DELETE', path, handler))
  }

  private findPattern(...[event, context]: Parameters<Handler>): Pattern | undefined {
    return this.patterns.find(pattern => pattern.matches([event, context]))
  }

  private tryParseBody(...[event]: Parameters<Handler>): JsonOutput {
    if (event.body === null) {
      return null
    }

    try {
      return JSON.parse(event.body)
    } catch {
      return null
    }
  }

  public async execute(...[event, context]: Parameters<Handler>): Promise<HandlerResponse> {
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
      }
    }

    const pattern = this.findPattern(event, context)

    if (pattern) {
      const [, ...args] = pattern.regexp.exec(event.path) ?? []
      const body = this.tryParseBody(event, context)
      const result = await pattern.handler(args, body)(event, context)
      console.log({ result })

      if (result) {
        return {
          headers,
          ...result,
        }
      }
    }

    console.log('NO MATCH')

    return {
      statusCode: 404,
      headers,
    }
  }
}