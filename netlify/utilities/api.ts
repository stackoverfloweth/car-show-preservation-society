import { Handler, HandlerResponse } from '@netlify/functions'
import { Pattern, PatternHandler } from 'netlify/types'

const headers = {
  'Access-Control-Allow-Origin': '*', // Allow from anywhere
}

export class Api {
  private readonly patterns: Pattern[] = []

  public get(path: RegExp, handler: PatternHandler): void {
    this.patterns.push({ method: 'GET', path, handler })
  }

  public put(path: RegExp, handler: PatternHandler): void {
    this.patterns.push({ method: 'PUT', path, handler })
  }

  public post(path: RegExp, handler: PatternHandler): void {
    this.patterns.push({ method: 'POST', path, handler })
  }

  public delete(path: RegExp, handler: PatternHandler): void {
    this.patterns.push({ method: 'DELETE', path, handler })
  }

  private findPattern(...[event]: Parameters<Handler>): Pattern | undefined {
    return this.patterns.find(({ method, path }) => {
      if (method !== event.httpMethod) {
        return false
      }

      const [matches] = path.exec(event.path) ?? []

      return !!matches
    })
  }

  public async execute(...[event, context]: Parameters<Handler>): Promise<HandlerResponse> {
    const action = this.findPattern(event, context)

    if (action) {
      const [, ...args] = action.path.exec(event.path) ?? []
      const result = await action.handler(...args)(event, context)

      if (result) {
        return {
          headers,
          ...result,
        }
      }
    }

    return {
      statusCode: 404,
      headers,
    }
  }
}