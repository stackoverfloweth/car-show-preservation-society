import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { AdvertisementRequest, AdvertisementResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { isValidImageRequest, uploadMedia } from 'netlify/utilities/images'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api<AdvertisementRequest>('POST', 'sponsors-create', (args, body) => async () => {
  if (!body) {
    return { statusCode: 400 }
  }

  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<AdvertisementResponse>('advertisement')

    const { advertisementId, image: imageRequest, ...rest } = body
    const insert: AdvertisementResponse = {
      ...rest,
      _id: new ObjectId(),
    }

    if (isValidImageRequest(imageRequest)) {
      insert.image = await uploadMedia(imageRequest)
    }

    const result = await collection.insertOne(insert)

    return {
      statusCode: 201,
      body: JSON.stringify(result.insertedId),
    }
  } finally {
    // await client.close()
  }
})