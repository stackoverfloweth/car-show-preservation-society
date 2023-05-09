import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { EventResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api('GET', 'events-images-get-list/:id', ([eventId]) => async () => {
  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<EventResponse>('event')

    const event = await collection.findOne(
      { _id: new ObjectId(eventId) },
      { projection: { images: 1 } },
    )

    if (!event) {
      return { statusCode: 404 }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        hasMore: false,
        images: event.images,
      }),
    }
  } finally {
    await client.close()
  }
})