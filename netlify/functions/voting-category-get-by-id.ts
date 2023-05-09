import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { VotingCategoryResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api('GET', 'voting-category-get-by-id/:id', ([eventId]) => async () => {
  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<VotingCategoryResponse>('voting-category')
    const votingCategory = await collection.findOne({ _id: new ObjectId(eventId) })

    if (!votingCategory) {
      return { statusCode: 404 }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(votingCategory),
    }
  } finally {
    await client.close()
  }
})