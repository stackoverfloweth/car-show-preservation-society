import { Handler } from '@netlify/functions'
import { addWeeks } from 'date-fns'
import { VotingResultResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('GET', 'voting-results-get-recent-events-by-user/:userId', ([userId]) => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<VotingResultResponse>('voting-result')

    const votingResults = await collection.aggregate([
      {
        $match: {
          'registration.userId': userId,
          'registration.checkInDate': { $gt: addWeeks(new Date(), -2) },
        },
      },
      {
        $addFields: {
          eventIdObjectId: { $toObjectId: '$eventId' },
          votingCategoryObjectId: { $toObjectId: '$votingCategoryId' },
        },
      },
      {
        $lookup: {
          from: 'voting-category',
          localField: 'votingCategoryObjectId',
          foreignField: '_id',
          as: 'votingCategory',
        },
      },
      {
        $lookup: {
          from: 'event',
          localField: 'eventIdObjectId',
          foreignField: '_id',
          as: 'event',
        },
      },
      {
        $project: {
          result: {
            _id: '$_id',
            eventId: '$eventId',
            votingCategoryId: '$votingCategoryId',
            // registration: '$registration',
            place: '$place',
            placeNumber: '$placeNumber',
          },
          votingCategory: { $first: '$votingCategory' },
          event: { $first: '$event' },
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