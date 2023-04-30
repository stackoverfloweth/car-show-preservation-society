import { Handler } from '@netlify/functions'
import { RegistrationResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('GET', 'registrations-get-count/:eventId', ([eventId]) => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<RegistrationResponse>('registration')

    const count = await collection.countDocuments({
      eventId,
      $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
    })

    return {
      statusCode: 200,
      body: JSON.stringify(count),
    }
  } finally {
    // await client.close()
  }
})