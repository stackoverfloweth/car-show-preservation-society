import { Handler } from '@netlify/functions'
import { VotingCategoryResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('GET', 'registrations-search-list/:needle', ([needle]) => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<VotingCategoryResponse>('registration')

    const votingCategories = await collection
      .find({
        // todo: actually do this
        // needle can be firstname, lastname, email, phone, displayName, carId, registrationCode
        needle,
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