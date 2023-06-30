import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { BallotResponse, EventResponse, RegistrationResponse } from '@/models/api'
import { Api, env, getUser } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api('GET', 'ballots-get-by-token-and-event/:eventId', ([eventId]) => async (requestEvent, context) => {
  const client = await getClient()

  try {
    const user = getUser(context, requestEvent.headers.host)
    const db = client.db(env().mongodbName)
    const events = db.collection<EventResponse>('event')
    const registrations = db.collection<RegistrationResponse>('registration')
    const ballots = db.collection<BallotResponse>('ballot')

    const [event, registration] = await Promise.all([
      events.findOne({ _id: new ObjectId(eventId) }),
      registrations.aggregate<RegistrationResponse>([
        {
          $match: {
            eventId,
          },
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
          $match: {
            'user.identityId': user.id,
          },
        },
      ]).next(),
      registrations.findOne({ eventId }),
    ])

    if (!event || !registration) {
      return { statusCode: 404 }
    }

    if (event.ballotCount === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify([]),
      }
    }

    const ballotCount = event.ballotCount ?? 1
    const existingBallots = await ballots.find(
      { registrationId: registration._id.toString() },
    ).toArray()

    if (existingBallots.length > ballotCount) {
      await ballots.deleteMany({ index: { $gte: ballotCount } })
      existingBallots.splice(ballotCount, existingBallots.length - ballotCount)
    } else if (existingBallots.length < ballotCount) {
      const newBallotsNeeded: BallotResponse[] = []
      while (existingBallots.length < ballotCount) {
        const ballotId = new ObjectId()

        const ballot = {
          _id: ballotId,
          index: existingBallots.length,
          eventId,
          registrationId: registration._id.toString(),
          votes: [],
        }

        newBallotsNeeded.push(ballot)
        existingBallots.push(ballot)
      }

      await ballots.insertMany(newBallotsNeeded)
    }

    return {
      statusCode: 200,
      body: JSON.stringify(existingBallots),
    }
  } finally {
    await client.close()
  }
})