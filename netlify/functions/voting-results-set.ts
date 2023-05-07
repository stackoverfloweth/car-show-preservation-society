import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { BallotResponse, BallotVotingCategoryResponse, RegistrationResponse, VotingResultResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

// todo: this should be an async background task?

type JoinedVotes = BallotVotingCategoryResponse & {
  registration: RegistrationResponse,
}
type RegistrationsByCategoryWithCount = {
  registration: RegistrationResponse,
  count: number,
}

export const handler: Handler = Api('POST', 'voting-results-set/:eventId', ([eventId]) => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const ballotsCollection = db.collection<BallotResponse>('ballot')
    const resultsCollection = db.collection<VotingResultResponse>('voting-result')

    const ballots = await ballotsCollection.aggregate([
      { $match: { eventId } },
      {
        $lookup: {
          from: 'registration',
          localField: 'votes.voteId',
          foreignField: 'voteId',
          as: 'voters',
        },
      },
      {
        $set: {
          votes: {
            $map: {
              input: '$votes',
              as: 'vote',
              in: {
                $mergeObjects: [
                  '$$vote',
                  {
                    registration: {
                      $first: {
                        $filter: {
                          input: '$voters',
                          as: 'voter',
                          cond: { $eq: ['$$vote.carId', '$$voter.carId'] },
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      { $unset: 'voters' },
    ]).toArray()

    const votes: JoinedVotes[] = ballots.flatMap(ballot => ballot.votes)
    const registrationByCategory = votes
      .map(({ votingCategory, registration }) => ({
        votingCategoryId: votingCategory._id.toString(),
        registration,
      }))
      .reduce((grouped, { registration, votingCategoryId }) => {
        if (!grouped.has(votingCategoryId)) {
          grouped.set(votingCategoryId, new Map())
        }

        addVoteToTally(grouped.get(votingCategoryId)!, registration)

        return grouped
      }, new Map<string, Map<string, RegistrationsByCategoryWithCount>>())

    const results = Array.from(registrationByCategory).flatMap(([votingCategoryId, registrationsMap]) => determineResultsForCategory(registrationsMap).map(placement => ({
      _id: new ObjectId(),
      eventId,
      votingCategoryId,
      ...placement,
    })))

    await resultsCollection.deleteMany({ eventId })
    await resultsCollection.insertMany(results)

    return {
      statusCode: 200,
      body: JSON.stringify(results),
    }
  } finally {
    // await client.close()
  }
})

function addVoteToTally(map: Map<string, RegistrationsByCategoryWithCount>, registration: RegistrationResponse): void {
  const registrationId = registration._id.toString()
  const registrationTally = map.get(registrationId)

  if (registrationTally) {
    registrationTally.count++
  } else {
    map.set(registrationId, {
      registration,
      count: 1,
    })
  }
}

type PlacedRegistration = {
  registration: RegistrationResponse,
  place: string,
  placeNumber: number,
}
function determineResultsForCategory(map: Map<string, RegistrationsByCategoryWithCount>): PlacedRegistration[] {
  const sorted = Array.from(map.values()).sort((registrationA, registrationB) => registrationB.count - registrationA.count)
  const groupedByCount = sorted.reduce((grouped, { count, registration }) => {
    if (grouped.has(count)) {
      grouped.get(count)?.push(registration)
    } else {
      grouped.set(count, [registration])
    }

    return grouped
  }, new Map<number, RegistrationResponse[]>())

  let currentPlace = 0
  return Array.from(groupedByCount.values()).flatMap(registrations => {
    currentPlace++
    const isTie = registrations.length > 1

    return registrations.map(registration => ({
      registration,
      place: `${isTie ? 'T' : ''}${currentPlace.toString()}`,
      placeNumber: currentPlace,
    }))
  })
}