import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { RegistrationResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('POST', 'registrations-check-in/:id', ([id]) => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<RegistrationResponse>('registration')

    const carId = 'C123'
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { carId },
    )

    return {
      statusCode: result.matchedCount === 1 ? 202 : 400,
      body: JSON.stringify(carId),
    }
  } finally {
    // await client.close()
  }
})
