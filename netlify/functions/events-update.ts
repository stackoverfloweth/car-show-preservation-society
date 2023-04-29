import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { EventRequest, EventResponse } from '@/models'
import { Api, env } from 'netlify/utilities'
import { isValidImageRequest, uploadMedia } from 'netlify/utilities/images'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api<EventRequest>('PUT', 'events-update/:id', (args, body) => async () => {
  if (!body) {
    return { statusCode: 400 }
  }

  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<EventResponse>('event')

    const { eventId, image: imageRequest, ...rest } = body
    const image = isValidImageRequest(imageRequest) ? await uploadMedia(imageRequest) : undefined
    const result = await collection.updateOne({ _id: new ObjectId(eventId) }, {
      $set: {
        ...rest,
        images: undefined,
        image,
      },
    })


    return { statusCode: result.acknowledged ? 202 : 400 }
  } finally {
    await client.close()
  }
})
