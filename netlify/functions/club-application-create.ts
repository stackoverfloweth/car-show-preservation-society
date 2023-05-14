import { Handler } from '@netlify/functions'
import { Db, ObjectId } from 'mongodb'
import { ClubApplicationResponse, ClubResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { sendEmail } from 'netlify/utilities/email'
import { getClient } from 'netlify/utilities/mongodbClient'


// todo: needs to send an email
export const handler: Handler = Api('POST', 'club-application-create/:clubId', ([clubId], body) => async () => {
  if (!isValidRequest(body)) {
    return { statusCode: 400 }
  }

  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<ClubApplicationResponse>('club-application')

    // todo: make sure user isn't already member

    if (!await clubIsJoinableByApplication(db, clubId)) {
      return { statusCode: 400 }
    }

    const result = await collection.insertOne({
      _id: new ObjectId(),
      clubId: clubId,
      userId: body.userId,
      message: body.message,
    })

    await sendEmail('clubNewApplication', 'ev@nsuther.land', 'stackoverfloweth@gmail.com', 'New application received', {})

    return {
      statusCode: 201,
      body: JSON.stringify(result.insertedId),
    }
  } finally {
    await client.close()
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