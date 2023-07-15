import { Handler } from '@netlify/functions'
import { VehicleResponse } from '@/models/api'
import { Api, env, getUser } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('GET', 'vehicles-get-list-by-token', () => async (event, context) => {
  const client = await getClient()

  try {
    const user = getUser(context, event.headers.host)
    const db = client.db(env().mongodbName)
    const collection = db.collection<VehicleResponse>('vehicle')

    const vehicles = await collection.aggregate([
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
        $match: {
          'user.identityId': user.id,
          $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
        },
      },
      { $unset: 'images' },
    ]).toArray()

    return {
      statusCode: 200,
      body: JSON.stringify(vehicles),
    }
  } finally {
    await client.close()
  }
})