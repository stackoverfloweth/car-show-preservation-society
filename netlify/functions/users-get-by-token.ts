import { Handler } from '@netlify/functions'
import { UserResponse } from '@/models/api'
import { Api, env, getUser } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('GET', 'users-get-by-token', () => async (event, context) => {
  const client = await getClient()

  try {
    const user = getUser(context, event.headers.host)
    const db = client.db(env().mongodbName)
    const collection = db.collection<UserResponse>('user')
    const userData = await collection.findOne(
      { identityId: user.id },
      { projection: { image: 0 } },
    )

    if (!userData) {
      return { statusCode: 404 }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(userData),
    }
  } catch (exception) {
    return {
      statusCode: 401,
      body: JSON.stringify(exception),
    }
  } finally {
    await client.close()
  }
})