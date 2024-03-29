import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { EventResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { isValidImageRequest, uploadMedia } from 'netlify/utilities/images'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api('POST', 'events-images-create/:id', ([eventId], body) => async () => {
  if (!isValidImageRequest(body)) {
    return {
      statusCode: 400,
    }
  }

  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<EventResponse>('event')

    const image = await uploadMedia(body)
    if (!image) {
      return { statusCode: 500 }
    }

    const insertedId = new ObjectId()
    const result = await collection.updateOne({ _id: new ObjectId(eventId) }, {
      $push: {
        'images': {
          ...image,
          _id: insertedId,
        },
      },
    })

    return {
      statusCode: result.modifiedCount === 1 ? 200 : 400,
      body: JSON.stringify(insertedId),
    }
  } finally {
    await client.close()
  }
})