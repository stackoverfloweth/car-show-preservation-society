import { Handler } from '@netlify/functions'
import { ClubApplicationResponse, ClubInviteResponse, ClubMembershipResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api('GET', 'club-member-get-list/:clubId', ([clubId]) => async () => {
  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const membersCollection = db.collection<ClubMembershipResponse>('club-member')
    const invitationsCollection = db.collection<ClubInviteResponse>('club-invite')
    const applicationsCollections = db.collection<ClubApplicationResponse>('club-application')

    const list = await Promise.all([
      membersCollection.aggregate([
        {
          $match: { clubId },
        },
        {
          $addFields: {
            userIdObjectId: { $toObjectId: '$userId' },
          },
        },
        {
          $lookup: {
            from: 'user',
            localField: 'userIdObjectId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $project: {
            clubId: 1,
            clubPermissions: 1,
            userId: 1,
            user: { $first: '$user' },
          },
        },
      ]).toArray(),
      invitationsCollection.find({ clubId }).toArray(),
      applicationsCollections.aggregate([
        {
          $match: { clubId },
        },
        {
          $addFields: {
            userIdObjectId: { $toObjectId: '$userId' },
          },
        },
        {
          $lookup: {
            from: 'user',
            localField: 'userIdObjectId',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $project: {
            clubId: 1,
            clubPermissions: 1,
            userId: 1,
            user: { $first: '$user' },
          },
        },
      ]).toArray(),
    ])

    return {
      statusCode: 200,
      body: JSON.stringify(list.reduce<unknown[]>((all, collection) => all.concat(collection), [])),
    }
  } finally {
    await client.close()
  }
})