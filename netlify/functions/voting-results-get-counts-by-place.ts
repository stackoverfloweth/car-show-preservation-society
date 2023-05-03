import { Handler } from '@netlify/functions'
import { addWeeks } from 'date-fns'
import { VotingResultResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('GET', 'voting-results-get-counts-by-place/:userId', ([userId]) => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<VotingResultResponse>('voting-result')

    const votingResults = await collection.aggregate([
      {
        $match: {
          'registration.userId': userId,
        },
      },
      {
        $group: {
          _id: '$placeNumber',
          count: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          placeNumber: '$_id',
          count: 1,
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