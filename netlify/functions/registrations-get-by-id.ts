import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { RegistrationResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api('GET', 'registrations-get-by-id/:id', ([id]) => async () => {
  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<RegistrationResponse>('registration')
    const registration = await collection.findOne({ _id: new ObjectId(id) })

    if (!registration) {
      return { statusCode: 404 }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(registration),
    }
  } finally {
    await client.close()
  }
})