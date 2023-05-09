import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { EventResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api('GET', 'events-get-list-related/:eventId', ([eventId]) => async () => {
  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<EventResponse>('event')

    const event = await collection.findOne({ _id: new ObjectId(eventId) })

    if (!event) {
      return {
        statusCode: 200,
        body: JSON.stringify([]),
      }
    }

    const events = await collection.find(
      {
        // start: {
        //   $gt: new Date().toISOString(),
        // },
        clubId: event.clubId,
        _id: { $ne: new ObjectId(eventId) },
        $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
      },
      { projection: { images: 0 } },
    ).toArray()

    return {
      statusCode: 200,
      body: JSON.stringify(events),
    }
  } finally {
    await client.close()
  }
})