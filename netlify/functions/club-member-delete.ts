import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { ClubMembershipResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('DELETE', 'club-member-delete/:id', ([clubMembershipId]) => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<ClubMembershipResponse>('club-member')

    const result = await collection.deleteOne({ _id: new ObjectId(clubMembershipId) })

    return { statusCode: result.deletedCount === 1 ? 202 : 400 }
  } finally {
    // await client.close()
  }
})
