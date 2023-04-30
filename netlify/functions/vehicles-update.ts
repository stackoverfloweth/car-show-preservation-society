import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { VehicleRequest, VehicleResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { isValidImageRequest, uploadMedia } from 'netlify/utilities/images'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api<VehicleRequest>('PUT', 'vehicles-update/:id', (args, body) => async () => {
  if (!body) {
    return { statusCode: 400 }
  }

  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<VehicleResponse>('vehicle')

    const { vehicleId, image: imageRequest, ...rest } = body
    const $set: Partial<VehicleResponse> = rest

    if (isValidImageRequest(imageRequest)) {
      $set.image = await uploadMedia(imageRequest)
    }

    const result = await collection.updateOne({ _id: new ObjectId(vehicleId) }, { $set })

    return { statusCode: result.acknowledged ? 202 : 400 }
  } finally {
    // await client.close()
  }
})
