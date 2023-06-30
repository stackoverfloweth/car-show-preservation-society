import { Handler } from '@netlify/functions'
import { RegistrationResponse } from '@/models/api'
import { Api, env, getUser } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api('GET', 'registrations-get-by-token-and-event/:eventId', ([eventId]) => async (event, context) => {
  const client = await getClient()

  try {
    const user = getUser(context, event.headers.host)
    const db = client.db(env().mongodbName)
    const collection = db.collection<RegistrationResponse>('registration')
    const registration = await collection.aggregate([
      {
        $match: {
          eventId,
        },
      },
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
        },
      },
      {
        $addFields: {
          user: { $first: '$user' },
        },
      },
      { $unset: 'userIdObjectId' },
    ]).next()

    return {
      statusCode: 200,
      body: JSON.stringify(registration),
    }
  } finally {
    await client.close()
  }
})