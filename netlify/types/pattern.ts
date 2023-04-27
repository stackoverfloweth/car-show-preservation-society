import { Handler } from '@netlify/functions'
import { HttpMethod, JsonOutput } from '@/../netlify/types'

export type PatternHandler = (args: string[], body: JsonOutput) => Handler

export class Pattern {
  public method: HttpMethod
  public path: string
  public handler: PatternHandler

  public constructor(method: HttpMethod, path: string, handler: PatternHandler) {
    this.method = method
    this.path = path
    this.handler = handler
  }

  private readonly beforePath = '^/.netlify/functions/'
  private readonly idRegexp = '([\\w]{24})'
  private readonly afterPath = '[/]?$'

  public get regexp(): RegExp {
    const path = this.path.replace(/(:[\w-]+)/g, `${this.idRegexp}`)
    const value = `${this.beforePath}${path}${this.afterPath}`.replace(/(\/)\1+/, '/')
    return new RegExp(value)
  }

  public matches([event]: Parameters<Handler>): boolean {
    if (this.method !== event.httpMethod) {
      return false
    }

    const [matches] = this.regexp.exec(event.path) ?? []

    return !!matches
  }
}