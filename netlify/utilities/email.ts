import { env } from 'netlify/utilities/env'

// eslint-disable-next-line max-params
export function sendEmail(template: string, from: string, to: string, subject: string, parameters: Record<string, string>): Promise<Response> {
  return fetch(`${env().url}/.netlify/functions/emails/${template}`, {
    headers: {
      'netlify-emails-secret': env().netlifyEmailsSecret,
    },
    method: 'POST',
    body: JSON.stringify({
      from,
      to,
      subject,
      parameters,
    }),
  })
}