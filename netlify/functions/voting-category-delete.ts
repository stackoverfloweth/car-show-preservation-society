import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { VotingCategoryResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('DELETE', 'voting-category-delete/:id', ([votingCategoryId]) => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<VotingCategoryResponse>('voting-category')

    const result = await collection.deleteOne({ _id: new ObjectId(votingCategoryId) })

    return { statusCode: result.deletedCount === 1 ? 202 : 400 }
  } finally {
    // await client.close()
  }
})
