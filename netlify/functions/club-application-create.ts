import { Handler } from '@netlify/functions'
import { Db, ObjectId } from 'mongodb'
import { ClubApplicationResponse, ClubResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

// todo: needs to send an email
export const handler: Handler = Api('POST', 'club-application-create', ([clubId], body) => async () => {
  if (!isValidRequest(body)) {
    return { statusCode: 400 }
  }

  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<ClubApplicationResponse>('club-application')

    if (!await clubIsJoinableByApplication(db, clubId)) {
      return { statusCode: 400 }
    }

    const result = await collection.insertOne({
      _id: new ObjectId(),
      clubId: clubId,
      userId: body.userId,
      message: body.message,
    })

    return {
      statusCode: 201,
      body: JSON.stringify(result.insertedId),
    }
  } finally {
    // await client.close()
  }
})

async function clubIsJoinableByApplication(db: Db, clubId: string): Promise<boolean> {
  const clubs = db.collection<ClubResponse>('club')
  const club = await clubs.findOne({ _id: new ObjectId(clubId) })

  return !club?.joinableByAnyone && club?.joinableByApplication === true
}

function isValidRequest(value: unknown): value is { userId: string, message: string | undefined } {
  return !!value && typeof value === 'object' && 'userId' in value && typeof value.userId === 'string'
}