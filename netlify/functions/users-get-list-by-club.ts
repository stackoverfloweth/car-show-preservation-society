import { Handler } from '@netlify/functions'
import { ClubMembershipResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api('GET', 'users-get-list-by-club/:clubId', ([clubId]) => async (event, context) => {
  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<ClubMembershipResponse>('club-member')

    const users = await collection.aggregate([
      { $match: { clubId } },
      {
        $addFields: {
          userIdObjectId: { $toObjectId: '$userId' },
        },
      },
      {
        $lookup: {
          from: 'user',
          localField: 'userIdObjectId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $project: {
          clubId: 1,
          userId: 1,
          user: { $first: '$user' },
        },
      },
      { $match: { $or: [{ 'user.isDeleted': false }, { 'user.isDeleted': { $exists: false } }] } },
    ]).toArray()

    return {
      statusCode: 200,
      body: JSON.stringify(users),
    }
  } finally {
    await client.close()
  }
})