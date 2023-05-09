import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { VehicleRequest, VehicleResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { isValidImageRequest, uploadMedia } from 'netlify/utilities/images'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api<VehicleRequest>('POST', 'vehicles-create', (args, body) => async () => {
  if (!body) {
    return { statusCode: 400 }
  }

  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<VehicleResponse>('vehicle')

    const { vehicleId, image: imageRequest, ...rest } = body
    const insert: VehicleResponse = {
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
    await client.close()
  }
})
