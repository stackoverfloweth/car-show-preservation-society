import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { ClubResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('DELETE', 'clubs-delete/:id', ([clubId]) => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<ClubResponse>('club')

    const result = await collection.deleteOne({ _id: new ObjectId(clubId) })

    return { statusCode: result.deletedCount === 1 ? 202 : 400 }
  } finally {
    // await client.close()
  }
})
