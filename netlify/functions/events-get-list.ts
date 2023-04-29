import { Handler } from '@netlify/functions'
import { EventResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('GET', 'events-get-list', () => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<EventResponse>('event')

    const events = await collection.find({ $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] }).toArray()

    return {
      statusCode: 200,
      body: JSON.stringify(events),
    }
  } finally {
    await client.close()
  }
})