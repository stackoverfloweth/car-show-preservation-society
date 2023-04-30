import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { EventResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('GET', 'events-get-by-id/:id', ([eventId]) => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<EventResponse>('event')
    const event = await collection.findOne(
      { _id: new ObjectId(eventId) },
      { projection: { images: 0 } },
    )

    if (!event) {
      return { statusCode: 404 }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(event),
    }
  } finally {
    // await client.close()
  }
})