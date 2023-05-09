import { Handler } from '@netlify/functions'
import { VotingCategoryResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api('GET', 'voting-category-get-list/:eventId', ([eventId]) => async () => {
  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<VotingCategoryResponse>('voting-category')

    const votingCategories = await collection
      .find({
        eventId,
        $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
      })
      .sort({ featured: -1, name: 1 })
      .toArray()

    return {
      statusCode: 200,
      body: JSON.stringify(votingCategories),
    }
  } finally {
    await client.close()
  }
})