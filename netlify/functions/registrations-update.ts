import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { RegistrationRequest, RegistrationResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api<RegistrationRequest>('PUT', 'registrations-update/:id', (args, body) => async () => {
  if (!body) {
    return { statusCode: 400 }
  }

  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<RegistrationResponse>('registration')

    const { registrationId, ...rest } = body
    const $set: Partial<RegistrationResponse> = rest

    const result = await collection.updateOne({ _id: new ObjectId(registrationId) }, { $set })

    return { statusCode: result.acknowledged ? 202 : 400 }
  } finally {
    // await client.close()
  }
})
