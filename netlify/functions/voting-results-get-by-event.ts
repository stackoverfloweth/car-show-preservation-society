import { Handler } from '@netlify/functions'
import { VotingCategoryResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('GET', 'voting-results-get-by-event/:eventId', ([eventId]) => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<VotingCategoryResponse>('voting-category')

    const votingResults = await collection.aggregate([
      {
        $match: { eventId },
      },
      {
        $addFields: {
          idString: { $toString: '$_id' },
        },
      },
      {
        $lookup: {
          from: 'voting-result',
          localField: 'idString',
          foreignField: 'votingCategoryId',
          as: 'results',
        },
      },
      {
        $project: {
          _id: 0,
          votingCategory: '$$ROOT',
          results: '$results',
        },
      },
    ]).toArray()

    return {
      statusCode: 200,
      body: JSON.stringify(votingResults),
    }
  } finally {
    // await client.close()
  }
})