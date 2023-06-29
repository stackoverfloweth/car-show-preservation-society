import { Handler } from '@netlify/functions'
import { UserRequest, UserResponse } from '@/models/api'
import { Api, env, getUser } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api<UserRequest>('PUT', 'users-update', (args, body) => async (event, context) => {
  if (!body) {
    return { statusCode: 400 }
  }

  const client = await getClient()

  try {
    const user = getUser(context, event.headers.host)
    const db = client.db(env().mongodbName)
    const collection = db.collection<UserResponse>('user')

    const { emailAddress, ...$set } = body
    const result = await collection.updateOne({ identityId: user.id }, { $set })

    return { statusCode: result.acknowledged ? 202 : 400 }
  } catch (exception) {
    return {
      statusCode: 401,
      body: JSON.stringify(exception),
    }
  } finally {
    await client.close()
  }
})
