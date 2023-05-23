import { Handler } from '@netlify/functions'
import { UserResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('GET', 'users-get-by-identity/:id', ([identityId]) => async () => {
  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<UserResponse>('user')
    const user = await collection.findOne(
      { identityId },
      { projection: { image: 0 } },
    )

    if (!user) {
      return { statusCode: 404 }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(user),
    }
  } finally {
    await client.close()
  }
})