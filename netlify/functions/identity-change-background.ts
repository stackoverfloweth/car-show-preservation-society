import type { BackgroundHandler } from '@netlify/functions'
import { env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'

export const handler: BackgroundHandler = async function(event) {
  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection('user')

    await collection.insertOne({ 'event': 'change', 'body': event.body, query: event.queryStringParameters })
  } finally {
    await client.close()
  }
}