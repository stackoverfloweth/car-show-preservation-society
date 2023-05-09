import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { ClubRequest, ClubResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { isValidImageRequest, uploadMedia } from 'netlify/utilities/images'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api<ClubRequest>('POST', 'clubs-create', (args, body) => async () => {
  if (!body) {
    return { statusCode: 400 }
  }

  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const clubsCollection = db.collection<ClubResponse>('club')
    const clubMembershipCollection = db.collection<ClubResponse>('club-member')

    const { clubId, image: imageRequest, ...rest } = body
    const insert: ClubResponse = {
      ...rest,
      _id: new ObjectId(),
    }

    if (isValidImageRequest(imageRequest)) {
      insert.image = await uploadMedia(imageRequest)
    }

    const result = await clubsCollection.insertOne(insert)

    // todo: insert into clubMembershipCollection current User as primary contact

    return {
      statusCode: 201,
      body: JSON.stringify(result.insertedId),
    }
  } finally {
    await client.close()
  }
})
