import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { ClubMembershipResponse, ClubResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api('POST', 'club-member-set-admin', (args, body) => async () => {
  if (!isValidRequest(body)) {
    return { statusCode: 400 }
  }

  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const members = db.collection<ClubMembershipResponse>('club-member')
    const clubs = db.collection<ClubResponse>('club')

    const member = await members.findOne({ _id: new ObjectId() })

    if (!member) {
      return { statusCode: 400 }
    }

    const result = await clubs.updateOne(
      { _id: new ObjectId(member.clubId) },
      { $set: { contactUserId: member.userId } },
    )

    // todo: if not admin, return []

    return { statusCode: result.acknowledged ? 202 : 400 }
  } finally {
    await client.close()
  }
})

function isValidRequest(value: unknown): value is { clubMembershipId: string } {
  return !!value && typeof value === 'object' && 'clubMembershipId' in value && typeof value.clubMembershipId === 'string'
}