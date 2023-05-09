import { Handler } from '@netlify/functions'
import { endOfToday, startOfToday } from 'date-fns'
import { EventResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api('GET', 'events-get-list-today', () => async () => {
  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<EventResponse>('event')

    const events = await collection.find(
      {
        start: {
          $gt: startOfToday().toISOString(),
          $lt: endOfToday().toISOString(),
        },
        end: {
          $gt: new Date().toISOString(),
        },
        // todo: CURRENT USER MUST BE REGISTERED
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