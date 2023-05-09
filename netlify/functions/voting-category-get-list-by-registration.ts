import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { RegistrationResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api('GET', 'voting-category-get-list-by-registration/:registrationId', ([registrationId]) => async () => {
  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<RegistrationResponse>('registration')
    const [results] = await collection.aggregate([
      { $match: { _id: new ObjectId(registrationId) } },
      {
        $project: {
          votingCategoryIds: {
            $map: {
              input: '$votingCategoryIds',
              as: 'categoryId',
              in: { $toObjectId: '$$categoryId' },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'voting-category',
          localField: 'votingCategoryIds',
          foreignField: '_id',
          as: 'votingCategories',
        },
      },
    ]).toArray()

    return {
      statusCode: 200,
      body: JSON.stringify('votingCategories' in results ? results.votingCategories : []),
    }
  } finally {
    await client.close()
  }
})