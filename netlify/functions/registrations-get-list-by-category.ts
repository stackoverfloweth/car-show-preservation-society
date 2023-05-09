import { Handler } from '@netlify/functions'
import { RegistrationResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api('GET', 'registrations-get-list-by-category/:eventId/:votingCategoryId', ([eventId, votingCategoryId]) => async () => {
  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<RegistrationResponse>('registration')

    const votingCategories = await collection.aggregate([
      {
        $match: {
          eventId,
          votingCategoryIds: { $in: [votingCategoryId] },
          $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
        },
      },
      {
        $addFields: {
          userIdObjectId: { $toObjectId: '$userId' },
          vehicleIdObjectId: { $toObjectId: '$vehicleId' },
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
        $lookup: {
          from: 'vehicle',
          localField: 'vehicleIdObjectId',
          foreignField: '_id',
          as: 'vehicle',
        },
      },
      {
        $addFields: {
          user: { $first: '$user' },
          vehicle: { $first: '$vehicle' },
        },
      },
    ])
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