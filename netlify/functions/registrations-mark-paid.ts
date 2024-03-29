import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { VotingCategoryResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api('POST', 'registrations-mark-paid/:id', ([id]) => async () => {
  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<VotingCategoryResponse>('registration')

    const result = await collection.updateOne({ _id: new ObjectId(id) }, {})

    return { statusCode: result.matchedCount === 1 ? 202 : 400 }
  } finally {
    await client.close()
  }
})
