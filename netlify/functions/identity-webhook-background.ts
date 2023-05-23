import type { BackgroundHandler } from '@netlify/functions'
import { env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'
import { verifyJWS } from 'netlify/utilities/security'

export const handler: BackgroundHandler = async function(event) {
  const client = await getClient()

  try {
    const signature = event.headers['x-webhook-signature']
    const db = client.db(env().mongodbName)
    const collection = db.collection('user')

    if (!event.body || !verifyJWS(signature)) {
      return
    }

    /** @type {{user: { email: string, app_metadata: { roles?: string[]}}}} */
    let payload = null
    try {
      payload = JSON.parse(event.body)
    } catch (exception) {
      // do nothing
    }

    await collection.insertOne({ ...event, user: payload.user })

  } finally {
    await client.close()
  }
}