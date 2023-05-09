import { Handler } from '@netlify/functions'
import { VotingCategoryResponse } from '@/models/api'
import { env, headers } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
    }
  }

  if (event.httpMethod !== 'GET' || !event.path.startsWith('/.netlify/functions/registrations-search-list/')) {
    return { statusCode: 404 }
  }

  const needle = event.path.replace('/.netlify/functions/registrations-search-list/', '')

  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<VotingCategoryResponse>('registration')

    const votingCategories =
    await collection.aggregate([
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
      {
        $addFields: {
          searchValues: {
            $concat: [
              { $ifNull: ['$user.firstName', ''] },
              ' ',
              { $ifNull: ['$user.lastName', ''] },
              ' ',
              { $ifNull: ['$user.emailAddress', ''] },
              ' ',
              { $ifNull: ['$user.phoneNumber', ''] },
              ' ',
              { $ifNull: ['$user.displayName', ''] },
              ' ',
              { $ifNull: ['$carId', ''] },
              ' ',
              { $ifNull: ['$registrationCode', ''] },
            ],
          },
        },
      },
      {
        $match: {
          searchValues: { $regex: needle, $options: 'i' },
          $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
        },
      },
      {
        $unset: 'searchValues',
      },
    ])
      .sort({ featured: -1, name: 1 })
      .toArray()

    return {
      headers,
      statusCode: 200,
      body: JSON.stringify(votingCategories),
    }
  } finally {
    await client.close()
  }
}