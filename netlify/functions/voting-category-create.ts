import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { VotingCategoryRequest, VotingCategoryResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api<VotingCategoryRequest>('POST', 'voting-category-create', (args, body) => async () => {
  if (!body) {
    return { statusCode: 400 }
  }

  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<VotingCategoryResponse>('voting-category')

    const { votingCategoryId, ...rest } = body
    const insert: VotingCategoryResponse = {
      ...rest,
      _id: new ObjectId(),
    }

    const result = await collection.insertOne(insert)

    return {
      statusCode: 201,
      body: JSON.stringify(result.insertedId),
    }
  } finally {
    // await client.close()
  }
})
