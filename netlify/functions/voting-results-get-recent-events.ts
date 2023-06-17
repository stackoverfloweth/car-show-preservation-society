import { Handler } from '@netlify/functions'
import { addWeeks } from 'date-fns'
import { VotingResultResponse } from '@/models/api'
import { AuthenticatedApi, env, hasIdentity } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = AuthenticatedApi('GET', 'voting-results-get-recent-events', () => async (event, context) => {
  const client = await getClient()
  if (!hasIdentity(context)) {
    return {
      statusCode: 401,
    }
  }

  const { user } = context

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<VotingResultResponse>('voting-result')

    const votingResults = await collection.aggregate([
      {
        $addFields: {
          userIdObjectId: { $toObjectId: '$userId' },
          eventIdObjectId: { $toObjectId: '$eventId' },
          votingCategoryObjectId: { $toObjectId: '$votingCategoryId' },
        },
      },
      {
        $lookup: {
          from: 'user',
          localField: 'userIdObjectId',
          foreignField: 'id',
          as: 'user',
        },
      },
      {
        $match: {
          'user.identityId': user.id,
          'registration.checkInDate': { $gt: addWeeks(new Date(), -2) },
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
          _id: 0,
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
    await client.close()
  }
})