import { Handler } from '@netlify/functions'
import { ClubRequest, IClub } from '@/models'
import { Api, env } from 'netlify/utilities'
import { isValidImageRequest, uploadMedia } from 'netlify/utilities/images'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api<ClubRequest>('POST', 'clubs-create', (args, body) => async () => {
  if (!body) {
    return { statusCode: 400 }
  }

  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<IClub>('club')

    const { clubId, image: imageRequest, ...rest } = body
    const image = isValidImageRequest(imageRequest) ? await uploadMedia(imageRequest) : undefined
    const inserted = await collection.insertOne({
      ...rest,
      image,
    } as IClub)

    return {
      statusCode: 201,
      body: JSON.stringify(inserted),
    }
  } finally {
    await client.close()
  }
})
