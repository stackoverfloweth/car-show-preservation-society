import { Handler } from '@netlify/functions'
import { addWeeks } from 'date-fns'
import { EventResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('GET', 'events-get-list-upcoming', () => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<EventResponse>('event')

    const events = await collection.find(
      {
        start: {
          $gt: new Date().toISOString(),
          $lt: addWeeks(new Date(), 2).toISOString(),
        },
        $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
      },
      { projection: { images: 0 } },
    ).toArray()

    return {
      statusCode: 200,
      body: JSON.stringify(events),
    }
  } finally {
    // await client.close()
  }
})