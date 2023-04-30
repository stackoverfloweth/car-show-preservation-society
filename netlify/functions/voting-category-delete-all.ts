import { Handler } from '@netlify/functions'
import { VotingCategoryResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('DELETE', 'voting-category-delete-all/:eventId', ([eventId]) => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<VotingCategoryResponse>('voting-category')

    const result = await collection.deleteMany({ eventId })

    return { statusCode: result.acknowledged ? 202 : 400 }
  } finally {
    // await client.close()
  }
})
