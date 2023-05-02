import { Handler } from '@netlify/functions'
import { UserResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('GET', 'users-get-by-phone-and-email/:phoneNumber/:emailAddress', ([phoneNumber, emailAddress]) => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<UserResponse>('user')
    const user = await collection.findOne(
      { $or: [{ phoneNumber }, { emailAddress }] },
      { projection: { images: 0 } },
    )

    if (!user) {
      return { statusCode: 404 }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(user),
    }
  } finally {
    // await client.close()
  }
})