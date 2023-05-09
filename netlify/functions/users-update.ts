import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { UserRequest, UserResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { isValidImageRequest, uploadMedia } from 'netlify/utilities/images'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api<UserRequest>('PUT', 'users-update/:id', (args, body) => async () => {
  if (!body) {
    return { statusCode: 400 }
  }

  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<UserResponse>('user')

    const { userId, image: imageRequest, ...rest } = body
    const $set: Partial<UserResponse> = rest

    if (isValidImageRequest(imageRequest)) {
      $set.image = await uploadMedia(imageRequest)
    }

    const result = await collection.updateOne({ _id: new ObjectId(userId) }, { $set })

    return { statusCode: result.acknowledged ? 202 : 400 }
  } finally {
    await client.close()
  }
})
