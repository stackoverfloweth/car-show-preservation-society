import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { ClubResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api('GET', 'clubs-get-by-id/:id', ([clubId]) => async () => {
  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<ClubResponse>('club')
    const club = await collection.findOne(
      { _id: new ObjectId(clubId) },
      { projection: { images: 0 } },
    )

    if (!club) {
      return { statusCode: 404 }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(club),
    }
  } finally {
    await client.close()
  }
})