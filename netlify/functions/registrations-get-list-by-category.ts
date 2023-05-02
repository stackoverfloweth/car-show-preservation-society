import { Handler } from '@netlify/functions'
import { RegistrationResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('GET', 'registrations-get-list-by-category/:eventId/:votingCategoryId', ([eventId, votingCategoryId]) => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<RegistrationResponse>('registration')

    const votingCategories = await collection
      .find({
        eventId,
        votingCategoryIds: { $elemMatch: { votingCategoryId } },
        $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }],
      })
      .sort({ featured: -1, name: 1 })
      .toArray()

    return {
      statusCode: 200,
      body: JSON.stringify(votingCategories),
    }
  } finally {
    // await client.close()
  }
})