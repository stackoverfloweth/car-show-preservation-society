import { Handler } from '@netlify/functions'
import { VotingCategoryResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('GET', 'voting-category-get-list/:eventId', ([eventId]) => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<VotingCategoryResponse>('voting-category')

    console.log({ eventId })
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
    // await client.close()
  }
})