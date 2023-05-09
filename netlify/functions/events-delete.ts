import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { EventResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api('DELETE', 'events-delete/:id', ([eventId]) => async () => {
  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<EventResponse>('event')

    const result = await collection.deleteOne({ _id: new ObjectId(eventId) })

    return { statusCode: result.deletedCount === 1 ? 202 : 400 }
  } finally {
    await client.close()
  }
})
