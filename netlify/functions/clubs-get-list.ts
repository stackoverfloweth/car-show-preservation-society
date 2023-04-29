import { Handler } from '@netlify/functions'
import { ClubResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('GET', 'clubs-get-list', () => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<ClubResponse>('club')

    const clubs = await collection.find({ $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] }).toArray()

    return {
      statusCode: 200,
      body: JSON.stringify(clubs),
    }
  } finally {
    await client.close()
  }
})