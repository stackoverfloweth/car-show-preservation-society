import GoTrue, { User } from 'gotrue-js'
import { env } from '@/utilities'

export const auth = new GoTrue({
  APIUrl: env().netlifyIdentityUrl,
  audience: '',
  setCookie: true,
})

export function currentUser(): User {
  const value = auth.currentUser()

  if (!value) {
    throw 'No user currently authenticated!'
  }

  return value
}