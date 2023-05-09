import { Handler } from '@netlify/functions'
import { RegistrationResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api('GET', 'registrations-get-count/:eventId', ([eventId]) => async () => {
  const client = await getClient()

  try {
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
    await client.close()
  }
})