import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { Api, env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api('DELETE', 'users-delete/:id', ([userId]) => async () => {
  const client = await getClient()

  // todo: rework now that user comes from netlify
  try {
    // const db = client.db(env().mongodbName)
    // const collection = db.collection<UserResponse>('user')

    // const result = await collection.deleteOne({ _id: new ObjectId(userId) })
    const result = { deletedCount: 0 }

    return { statusCode: result.deletedCount === 1 ? 202 : 400 }
  } finally {
    await client.close()
  }
})
