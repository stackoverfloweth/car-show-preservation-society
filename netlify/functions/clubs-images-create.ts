import { Handler } from '@netlify/functions'
import { ObjectId, WithId } from 'mongodb'
import { IClub, IImage } from '@/models'
import { Api, env } from 'netlify/utilities'
import { isValidImageRequest, uploadMedia } from 'netlify/utilities/images'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('POST', 'clubs-images-create/:id', ([clubId], body) => async () => {
  if (!isValidImageRequest(body)) {
    return {
      statusCode: 400,
    }
  }

  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<IClub & { images: WithId<IImage>[] }>('club')

    const image = await uploadMedia(body)
    if (!image) {
      return { statusCode: 500 }
    }

    const result = await collection.updateOne({ _id: new ObjectId(clubId) }, {
      $push: {
        'images': {
          ...image,
          _id: new ObjectId(),
        },
      },
    })

    return {
      statusCode: 200,
      body: JSON.stringify(result.acknowledged),
    }
  } finally {
    await client.close()
  }
})