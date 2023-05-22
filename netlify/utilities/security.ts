import { createHmac } from 'crypto'
import { env } from 'netlify/utilities/env'

export function verifyJWS(token?: string): boolean {
  if (!token) {
    return false
  }

  const secret = env().netlifyWebhookSecret
  const [params, payload, signature] = token.split('.')

  if (!params || !payload || !signature) {
    return false
  }

  const signedPayload = [params, payload].join('.')
  const hmac = createHmac('sha256', secret)

  hmac.update(signedPayload)

  return cleanupBase64(hmac.digest('base64')) === signature
}

function cleanupBase64(base64: string): string {
  return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}