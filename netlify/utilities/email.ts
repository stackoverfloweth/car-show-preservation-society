import axios from 'axios'
import { env } from 'netlify/utilities/env'

// eslint-disable-next-line max-params
export function sendEmail(template: string, from: string, to: string, subject: string, parameters: Record<string, string>): Promise<Response> {
  const instance = axios.create({
    baseURL: env().url,
    headers: {
      'netlify-emails-secret': env().netlifyEmailsSecret,
    },
  })

  return instance.post(`/.netlify/functions/emails/${template}`, {
    from,
    to,
    subject,
    parameters,
  })
}