import { Handler } from '@netlify/functions'
import { RegistrationsSearchRequest, VotingCategoryResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api<RegistrationsSearchRequest>('POST', 'registrations-search-list', (args, body) => async () => {
  if (!isValidRequest(body)) {
    return { statusCode: 400 }
  }

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
          searchValues: { $regex: body.needle, $options: 'i' },
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
      statusCode: 200,
      body: JSON.stringify(votingCategories),
    }
  } finally {
    await client.close()
  }
})

function isValidRequest(value: unknown): value is RegistrationsSearchRequest {
  return !!value && typeof value === 'object' && 'needle' in value && typeof value.needle === 'string'
}
