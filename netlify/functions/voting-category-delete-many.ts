import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { VotingCategoryResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api('POST', 'voting-category-delete-many', (args, body) => async () => {
  if (!isValidDeleteManyRequest(body)) {
    return {
      statusCode: 400,
    }
  }

  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<VotingCategoryResponse>('voting-category')

    const result = await collection.deleteMany({
      _id: { $in: body.votingCategoryIds.map(id => new ObjectId(id)) },
    })

    return { statusCode: result.acknowledged ? 202 : 400 }
  } finally {
    await client.close()
  }
})

function isValidDeleteManyRequest(value: unknown): value is { votingCategoryIds: string[] } {
  return !!value && typeof value === 'object' && 'votingCategoryIds' in value && Array.isArray(value.votingCategoryIds)
}