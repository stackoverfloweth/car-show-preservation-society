import { Handler } from '@netlify/functions'
import { ClubNameUniqueRequest, ClubResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api<ClubNameUniqueRequest>('POST', 'clubs-name-unique', (args, body) => async () => {
  if (!isValidRequest(body)) {
    return { statusCode: 400 }
  }

  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<ClubResponse>('club')

    const clubs = await collection.countDocuments({
      name: { $regex: `^${body.name}$`, $options: 'i' },
    })

    return {
      statusCode: 200,
      body: JSON.stringify(clubs === 0),
    }
  } finally {
    await client.close()
  }
})

function isValidRequest(value: unknown): value is ClubNameUniqueRequest {
  return !!value && typeof value === 'object' && 'name' in value && typeof value.name === 'string'
}
