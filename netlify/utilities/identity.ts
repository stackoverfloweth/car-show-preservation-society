import { HandlerContext } from '@netlify/functions'
import axios, { AxiosInstance } from 'axios'
import { User } from 'gotrue-js'

function AdminApi(context: HandlerContext): AxiosInstance {
  if (!hasIdentity(context.clientContext)) {
    throw 'netlify identity not available'
  }

  const { identity } = context.clientContext

  return axios.create({
    baseURL: `${identity.url}/admin`,
    headers: { Authorization: `Bearer ${identity.token}` },
  })
}

export function GetUsers(context: HandlerContext): Promise<User[]> {
  const instance = AdminApi(context)

  return instance.get<{ users: User[] }>('/users')
    .then(({ data }) => data.users)
}

export function hasIdentity(clientContext: unknown): clientContext is { identity: { url: string, token: string }, user: User } {
  return !!clientContext && typeof clientContext === 'object'
    && 'identity' in clientContext && typeof clientContext.identity === 'object' && !!clientContext.identity
  // && 'url' in clientContext.identity && typeof clientContext.identity.url === 'string'
  // && 'token' in clientContext.identity && typeof clientContext.identity.token === 'string'
}