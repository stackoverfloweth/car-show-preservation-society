import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { ClubApplicationResponse, ClubMembershipResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


// todo: needs to send an email
export const handler: Handler = Api('POST', 'club-application-accept/:clubApplicationId', ([clubApplicationId]) => async () => {
  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const applications = db.collection<ClubApplicationResponse>('club-application')
    const members = db.collection<ClubMembershipResponse>('club-member')

    const application = await applications.findOneAndDelete({ _id: new ObjectId(clubApplicationId) })

    if (!application.value) {
      // todo: application.userId must be current user
      return {
        statusCode: 400,
      }
    }

    const result = await members.insertOne({
      _id: new ObjectId(),
      clubId: application.value.clubId,
      userId: application.value.userId,
      clubPermissions: [],
    })

    return {
      statusCode: 201,
      body: JSON.stringify(result.insertedId),
    }
  } finally {
    await client.close()
  }
})