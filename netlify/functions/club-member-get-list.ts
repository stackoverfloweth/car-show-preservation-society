import { Handler } from '@netlify/functions'
import { ClubApplicationResponse, ClubInviteResponse, ClubMembershipResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { GetUsers } from 'netlify/utilities/identity'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api('GET', 'club-member-get-list/:clubId', ([clubId]) => async (event, context) => {
  const client = await getClient()

  try {
    // const db = client.db(env().mongodbName)
    // const membersCollection = db.collection<ClubMembershipResponse>('club-member')
    // const invitationsCollection = db.collection<ClubInviteResponse>('club-invite')
    // const applicationsCollections = db.collection<ClubApplicationResponse>('club-application')

    // const [members, users, invitations, applications] = await Promise.all([
    //   membersCollection.find({ clubId }).toArray(),
    //   GetUsers(context),
    //   invitationsCollection.find({ clubId }).toArray(),
    //   applicationsCollections.find({ clubId }).toArray(),
    // ])

    // const membersWithUser = members.map(member => ({
    //   ...member,
    //   user: users.find(user => user.id === member.userId),
    // }))

    // const applicationsWithUser = applications.map(application => ({
    //   ...application,
    //   user: users.find(user => user.id === application.userId),
    // }))

    // return {
    //   statusCode: 200,
    //   body: JSON.stringify([
    //     ...membersWithUser,
    //     ...invitations,
    //     ...applicationsWithUser,
    //   ]),
    // }

    const users = await GetUsers(context)

    return {
      statusCode: 200,
      body: JSON.stringify(users),
    }
  } finally {
    await client.close()
  }
})