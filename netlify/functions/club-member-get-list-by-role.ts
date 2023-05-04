import { Handler } from '@netlify/functions'
import { ClubMembershipResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('POST', 'club-member-get-list-by-role/:clubId', ([clubId], body) => async () => {
  if (!isValidRequest(body)) {
    return { statusCode: 400 }
  }

  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<ClubMembershipResponse>('club-member')

    // todo: if not admin, return []

    const members = await collection.find({ clubId, clubPermissions: { $in: [body.role] } }).toArray()

    return {
      statusCode: 200,
      body: JSON.stringify(members),
    }
  } finally {
    // await client.close()
  }
})

function isValidRequest(value: unknown): value is { role: string } {
  return !!value && typeof value === 'object' && 'role' in value && typeof value.role === 'string'
}