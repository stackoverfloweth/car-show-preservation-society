import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { VotingCategoryRequest, VotingCategoryResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api<VotingCategoryRequest>('PUT', 'voting-category-update/:id', (args, body) => async () => {
  if (!body) {
    return { statusCode: 400 }
  }

  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<VotingCategoryResponse>('voting-category')

    const { votingCategoryId, ...rest } = body
    const $set: Partial<VotingCategoryResponse> = rest

    const result = await collection.updateOne({ _id: new ObjectId(votingCategoryId) }, { $set })

    return { statusCode: result.acknowledged ? 202 : 400 }
  } finally {
    // await client.close()
  }
})
