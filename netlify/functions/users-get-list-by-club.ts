import { Handler } from '@netlify/functions'
import { ClubMembershipResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { GetUsers } from 'netlify/utilities/identity'
import { getClient } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('GET', 'users-get-list-by-club/:clubId', ([clubId]) => async (event, context) => {
  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<ClubMembershipResponse>('club-member')

    const [members, users] = await Promise.all([
      collection.find({ clubId }).toArray(),
      GetUsers(context),
    ])

    return {
      statusCode: 200,
      body: JSON.stringify(members.map(member => ({
        ...member,
        user: users.find(user => user.id === member.userId),
      }))),
    }
  } finally {
    await client.close()
  }
})