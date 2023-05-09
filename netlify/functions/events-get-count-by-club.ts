import { Handler } from '@netlify/functions'
import { EventResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api('GET', 'events-get-count-by-club/:clubId', ([clubId]) => async () => {
  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<EventResponse>('event')

    const count = await collection.countDocuments({
      clubId,
      $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
    })

    return {
      statusCode: 200,
      body: JSON.stringify(count),
    }
  } finally {
    await client.close()
  }
})