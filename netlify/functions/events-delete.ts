import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { IEvent } from '@/models'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('DELETE', 'events-delete/:id', ([eventId]) => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<IEvent>('event')

    const result = await collection.deleteOne({ _id: new ObjectId(eventId) })

    return { statusCode: result.deletedCount === 1 ? 202 : 400 }
  } finally {
    await client.close()
  }
})
