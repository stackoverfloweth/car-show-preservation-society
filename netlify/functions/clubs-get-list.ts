import { Handler } from '@netlify/functions'
import { ClubResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api('GET', 'clubs-get-list', () => async () => {
  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<ClubResponse>('club')

    const clubs = await collection.find(
      { $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] },
      { projection: { images: 0 } },
    ).toArray()

    return {
      statusCode: 200,
      body: JSON.stringify(clubs),
    }
  } finally {
    await client.close()
  }
})