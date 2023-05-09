import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { RegistrationRequest, RegistrationResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api<RegistrationRequest>('POST', 'registrations-create', (args, body) => async () => {
  if (!body) {
    return { statusCode: 400 }
  }

  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<Omit<RegistrationResponse, 'user' | 'vehicle'>>('registration')

    const { registrationId, ...rest } = body

    const result = await collection.insertOne({
      ...rest,
      registrationCode: 'R123',
      registrationDate: new Date(),
      _id: new ObjectId(),
    })

    return {
      statusCode: 201,
      body: JSON.stringify(result.insertedId),
    }
  } finally {
    await client.close()
  }
})
