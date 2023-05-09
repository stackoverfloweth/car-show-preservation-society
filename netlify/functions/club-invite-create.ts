import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { ClubInviteResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


// todo: needs to send an email
export const handler: Handler = Api('POST', 'club-invite-create/:clubId', ([clubId], body) => async () => {
  if (!isValidRequest(body)) {
    return { statusCode: 400 }
  }

  const client = await getClient()

  try {
    const { emailAddress } = body
    const db = client.db(env().mongodbName)
    const collection = db.collection<ClubInviteResponse>('club-invite')

    const existing = await collection.countDocuments({ clubId, emailAddress })

    if (existing !== 0) {
      // todo: should resend if already exists
    } else {
      await collection.insertOne({
        _id: new ObjectId(),
        clubId,
        emailAddress,
        clubPermissions: [],
      })
    }

    return {
      statusCode: 200,
    }
  } finally {
    await client.close()
  }
})

function isValidRequest(value: unknown): value is { emailAddress: string } {
  return !!value && typeof value === 'object' && 'emailAddress' in value && typeof value.emailAddress === 'string'
}