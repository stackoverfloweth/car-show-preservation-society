import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { ClubMembershipResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api('POST', 'club-member-set-member', (args, body) => async () => {
  if (!isValidRequest(body)) {
    return { statusCode: 400 }
  }

  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<ClubMembershipResponse>('club-member')

    // todo: if not admin, return []

    const result = await collection.updateOne(
      { _id: new ObjectId(body.clubMembershipId) },
      { $set: { clubPermissions: ['member'] } })

    return { statusCode: result.acknowledged ? 202 : 400 }
  } finally {
    await client.close()
  }
})

function isValidRequest(value: unknown): value is { clubMembershipId: string } {
  return !!value && typeof value === 'object' && 'clubMembershipId' in value && typeof value.clubMembershipId === 'string'
}