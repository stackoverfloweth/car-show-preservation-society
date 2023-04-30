import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { ClubResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('DELETE', 'clubs-images-delete/:clubId/:imageId', ([clubId, imageId]) => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<ClubResponse>('club')

    const result = await collection.updateOne(
      { _id: new ObjectId(clubId) },
      { $pull: { images: { _id: new ObjectId(imageId) } } },
    )

    return { statusCode: result.matchedCount === 1 ? 202 : 400 }
  } finally {
    // await client.close()
  }
})