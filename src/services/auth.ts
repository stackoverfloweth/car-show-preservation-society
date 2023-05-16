import { PButton, showToast } from '@prefecthq/prefect-design'
import GoTrue from 'gotrue-js'
import { h } from 'vue'
import { User } from '@/models'
import { mapper } from '@/services/mapper'
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

  return mapper.map('GoTrueUser', value, 'User')
}

export type AuthErrorType = 'invalid_grant' | 'unknown'
export type AuthError = {
  error: AuthErrorType,
  error_description: string,
}

function isAuthFetchError(value: unknown): value is { json: AuthError } {
  return !!value && typeof value === 'object'
    && 'json' in value && typeof value.json === 'object'
}

export function isAuthError(value: unknown): value is AuthError {
  return !!value && typeof value === 'object'
    && 'error_description' in value && typeof value.error_description === 'string'
    && 'error' in value && typeof value.error === 'string'
}

export function handleAuthError(exception: unknown, emailAddress?: string): void {
  if (isAuthFetchError(exception)) {
    return handleAuthError(exception.json, emailAddress)
  }

  if (!isAuthError(exception)) {
    showToast('Something went wrong', 'error')
    return
  }

  switch (exception.error_description) {
    case 'Email not confirmed':
      return handleUnconfirmed(emailAddress)
    default:
      showToast(exception.error_description, 'error')
  }
}

function handleUnconfirmed(emailAddress?: string): void {
  const { dismiss } = showToast(h(
    'div',
    { class: 'auth-error-message' },
    [
      h('p', { innerText: 'Email Address not verified!' }),
      emailAddress && h('div', { class: 'auth-error-message__actions' }, [
        h(PButton, {
          size: 'sm',
          flat: true,
          innerText: 'Resend Email',
          onClick: () => {
            auth.requestPasswordRecovery(emailAddress)
            dismiss()
          },
        }),
      ]),
    ],
  ), 'error', { timeout: false })
}