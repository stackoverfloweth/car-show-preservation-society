import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { VehicleResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('DELETE', 'vehicles-delete/:id', ([vehicleId]) => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<VehicleResponse>('vehicle')

    const result = await collection.deleteOne({ _id: new ObjectId(vehicleId) })

    return { statusCode: result.deletedCount === 1 ? 202 : 400 }
  } finally {
    // await client.close()
  }
})
