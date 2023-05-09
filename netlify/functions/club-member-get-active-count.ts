import { Handler } from '@netlify/functions'
import { ClubMembershipResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


// todo: needs to send an email
export const handler: Handler = Api('GET', 'club-member-get-active-count/:clubId', ([clubId]) => async () => {
  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<ClubMembershipResponse>('club-member')

    // todo: if not admin, return []

    const invitations = await collection.countDocuments({ clubId })

    return {
      statusCode: 200,
      body: JSON.stringify(invitations),
    }
  } finally {
    await client.close()
  }
})