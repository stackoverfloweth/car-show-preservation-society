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

    if (!verifyJWS(signature)) {
      await collection.insertOne({ 'event': 'failed webhook', token: signature, 'body': env().netlifyWebhookSecret })
      return
    }

    await collection.insertOne({ 'event': 'webhook', 'body': event.body, query: event.queryStringParameters })
  } finally {
    await client.close()
  }
}