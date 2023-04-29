import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { EventResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('GET', 'events-images-delete/:imageId', ([imageId]) => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<EventResponse>('event')

    const result = await collection.deleteOne({ _id: new ObjectId(imageId) })

    return { statusCode: result.deletedCount === 1 ? 202 : 400 }
  } finally {
    await client.close()
  }
})