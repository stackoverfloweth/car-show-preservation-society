import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { VehicleResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('DELETE', 'vehicles-images-delete/:vehicleId/:imageId', ([vehicleId, imageId]) => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<VehicleResponse>('vehicle')

    const result = await collection.updateOne(
      { _id: new ObjectId(vehicleId) },
      { $pull: { images: { _id: new ObjectId(imageId) } } },
    )

    return { statusCode: result.matchedCount === 1 ? 202 : 400 }
  } finally {
    // await client.close()
  }
})