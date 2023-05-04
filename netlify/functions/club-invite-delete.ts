import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { ClubApplicationResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

// todo: needs to send an email
export const handler: Handler = Api('DELETE', 'club-invite-delete/:id', ([clubInviteId]) => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<ClubApplicationResponse>('club-invite')

    const result = await collection.deleteOne({ _id: new ObjectId(clubInviteId) })

    return { statusCode: result.deletedCount === 1 ? 202 : 400 }
  } finally {
    // await client.close()
  }
})