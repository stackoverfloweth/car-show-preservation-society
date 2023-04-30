import { Handler } from '@netlify/functions'
import { EventResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('GET', 'events-get-list-by-club/:clubId', ([clubId]) => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<EventResponse>('event')

    const events = await collection.find(
      {
        clubId,
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