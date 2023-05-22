import type { Handler } from '@netlify/functions'
import { env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'

export const handler: Handler = async function(event) {
  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection('user')

    await collection.insertOne({ 'event': 'validate', 'body': event.body, query: event.queryStringParameters })

    return {
      statusCode: 200,
    }
  } finally {
    await client.close()
  }
}