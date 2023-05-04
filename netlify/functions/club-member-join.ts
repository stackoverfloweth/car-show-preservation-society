import { Handler } from '@netlify/functions'
import { Db, ObjectId } from 'mongodb'
import { ClubMembershipResponse, ClubResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

// todo: needs to send an email
export const handler: Handler = Api('POST', 'club-member-join/:clubId', ([clubId], body) => async () => {
  if (!isValidRequest(body)) {
    return { statusCode: 400 }
  }

  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<ClubMembershipResponse>('club-member')

    if (!await clubIsJoinableByAnyone(db, clubId)) {
      return { statusCode: 400 }
    }

    // todo: if not admin, return []

    const result = await collection.insertOne({
      _id: new ObjectId(),
      clubId: clubId,
      userId: body.userId,
      clubPermissions: [],
    })

    return {
      statusCode: 201,
      body: JSON.stringify(result.insertedId),
    }
  } finally {
    // await client.close()
  }
})

async function clubIsJoinableByAnyone(db: Db, clubId: string): Promise<boolean> {
  const clubs = db.collection<ClubResponse>('club')
  const club = await clubs.findOne({ _id: new ObjectId(clubId) })

  return club?.joinableByAnyone === true
}

function isValidRequest(value: unknown): value is { userId: string } {
  return !!value && typeof value === 'object' && 'userId' in value && typeof value.userId === 'string'
}