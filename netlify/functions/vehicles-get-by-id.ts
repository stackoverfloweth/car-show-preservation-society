import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { VehicleResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('GET', 'vehicles-get-by-id/:id', ([vehicleId]) => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<VehicleResponse>('vehicle')
    const vehicle = await collection.findOne(
      { _id: new ObjectId(vehicleId) },
      { projection: { images: 0 } },
    )

    if (!vehicle) {
      return { statusCode: 404 }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(vehicle),
    }
  } finally {
    // await client.close()
  }
})