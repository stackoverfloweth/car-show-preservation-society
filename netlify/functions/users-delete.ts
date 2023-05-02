import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { UserResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('DELETE', 'users-delete/:id', ([userId]) => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<UserResponse>('user')

    const result = await collection.deleteOne({ _id: new ObjectId(userId) })

    return { statusCode: result.deletedCount === 1 ? 202 : 400 }
  } finally {
    // await client.close()
  }
})
