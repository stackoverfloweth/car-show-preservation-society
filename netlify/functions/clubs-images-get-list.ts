import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { IClub } from '@/models'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('GET', 'clubs-images-get-list/:id', ([clubId]) => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<IClub>('club')

    const club = await collection.findOne({ _id: new ObjectId(clubId) }, { projection: { images: 1 } })

    if (!club) {
      return { statusCode: 404 }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        hasMore: false,
        images: club.images,
      }),
    }
  } finally {
    await client.close()
  }
})