import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { ClubApplicationResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

// todo: needs to send an email
export const handler: Handler = Api('POST', 'club-application-deny', ([clubRequestId]) => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<ClubApplicationResponse>('club-application')

    const application = await collection.findOneAndDelete({ _id: new ObjectId(clubRequestId) })

    // todo: send email to application.value?.userId

    return { statusCode: 202 }
  } finally {
    // await client.close()
  }
})