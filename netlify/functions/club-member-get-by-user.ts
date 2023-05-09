import { Handler } from '@netlify/functions'
import { ClubMembershipResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


// todo: needs to send an email
export const handler: Handler = Api('GET', 'club-member-get-by-user/:clubId/:userId', ([clubId, userId]) => async () => {
  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<ClubMembershipResponse>('club-member')

    // todo: if not admin, return []

    const membership = await collection.findOne({ clubId, userId })

    return {
      statusCode: 200,
      body: JSON.stringify(membership),
    }
  } finally {
    await client.close()
  }
})