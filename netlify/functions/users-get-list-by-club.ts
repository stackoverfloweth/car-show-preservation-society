import { Handler } from '@netlify/functions'
import { UserResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('GET', 'users-get-list-by-club', ([clubId]) => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<UserResponse>('user')

    const users = await collection.find(
      { clubId, $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] },
      { projection: { images: 0 } },
    ).toArray()

    return {
      statusCode: 200,
      body: JSON.stringify(users),
    }
  } finally {
    // await client.close()
  }
})