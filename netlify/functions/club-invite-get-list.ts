import { Handler } from '@netlify/functions'
import { ClubInviteResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

// todo: needs to send an email
export const handler: Handler = Api('GET', 'club-invite-get-list/:clubId', ([clubId]) => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<ClubInviteResponse>('club-invite')

    // todo: if not admin, return []

    const invitations = await collection.find({ clubId }).toArray()

    return {
      statusCode: 200,
      body: JSON.stringify(invitations),
    }
  } finally {
    // await client.close()
  }
})