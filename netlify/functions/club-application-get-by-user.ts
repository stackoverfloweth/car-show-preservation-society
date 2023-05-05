import { Handler } from '@netlify/functions'
import { ClubResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('GET', 'club-application-get-by-user/:userId', ([userId]) => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<ClubResponse>('club-application')
    const application = await collection.findOne({ userId })

    if (!application) {
      return { statusCode: 404 }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(application),
    }
  } finally {
    // await client.close()
  }
})