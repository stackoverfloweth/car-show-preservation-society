import { Handler } from '@netlify/functions'
import { User } from 'gotrue-js'
import { Api, ApiContext, ApiHandler, ApiMethod } from 'netlify/utilities/api'

export type AuthenticatedApiContext = ApiContext & { identity: { url: string, token: string }, user: User }

export function hasIdentity(clientContext: ApiContext): clientContext is AuthenticatedApiContext {
  return typeof clientContext === 'object'
    && 'identity' in clientContext && typeof clientContext.identity === 'object'
    && 'user' in clientContext && typeof clientContext.user === 'object'
}

export function getUser(clientContext: ApiContext, host?: string): User {
  if (host === 'localhost:9999') {
    return {
      'id': 'd4c24b3f-f0ef-4bf0-bff2-b0907bfab066',
    } as User
  }

  if (!hasIdentity(clientContext)) {
    throw 'Invalid Client Context'
  }

  const { user } = clientContext

  return user
}

export function AuthenticatedApi<T>(method: ApiMethod, path: string, apiHandler: ApiHandler<T>): Handler {
  return async (event, context) => {
    if (!hasIdentity(context)) {
      return { statusCode: 401 }
    }

    const result = await Api<T>(method, path, apiHandler)(event, context)

    if (!result) {
      return {
        statusCode: 500,
      }
    }

    return result
  }
}