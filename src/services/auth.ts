import GoTrue, { User } from 'gotrue-js'
import { env } from '@/utilities'

export const auth = new GoTrue({
  APIUrl: env().netlifyIdentityUrl,
  audience: '',
  setCookie: true,
})

export function isLoggedIn(): boolean {
  return !!auth.currentUser()
}

export function currentUser(): User {
  const value = auth.currentUser()

  if (!value) {
    throw 'No user currently authenticated!'
  }

  return value
}

export type AuthError = {
  error_description: string,
}
export function isAuthError(value: unknown): value is AuthError {
  return !!value && typeof value === 'object' && 'error_description' in value
}