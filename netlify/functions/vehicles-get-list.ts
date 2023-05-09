import { Handler } from '@netlify/functions'
import { VehicleResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api('GET', 'vehicles-get-list/:userId', ([userId]) => async () => {
  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<VehicleResponse>('vehicle')

    const vehicles = await collection.find(
      { userId, $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] },
      { projection: { images: 0 } },
    ).toArray()

    return {
      statusCode: 200,
      body: JSON.stringify(vehicles),
    }
  } finally {
    await client.close()
  }
})