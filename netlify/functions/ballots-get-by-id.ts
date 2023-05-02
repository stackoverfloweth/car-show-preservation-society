import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { BallotResponse, BallotVotingCategoryResponse, VotingCategoryResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('GET', 'ballots-get-by-id/:eventId/:ballotId', ([eventId, ballotId]) => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const ballots = db.collection<BallotResponse>('ballot')
    const categories = db.collection<VotingCategoryResponse>('voting-category')
    const ballot = await ballots.findOne(
      { _id: new ObjectId(ballotId) },
    )

    if (!ballot) {
      return { statusCode: 404 }
    }

    // remember that as a club member I might have ballots for membersOnly like drivers have driversOnly
    // todo: clubMembershipId: string,
    const eventCategories = await categories.find({ eventId, $or: [{ membersOnly: false }, { membersOnly: { $exists: false } }] }).toArray()
    const existingVotes = ballot.votes.reduce<Record<string, string | undefined>>((sum, vote) => ({
      ...sum,
      [vote.votingCategory._id.toString()]: vote.carId,
    }), {})

    ballot.votes = eventCategories.map<BallotVotingCategoryResponse>(category => ({
      _id: new ObjectId(),
      votingCategory: category,
      carId: existingVotes[category._id.toString()],
    }))

    return {
      statusCode: 200,
      body: JSON.stringify(ballot),
    }
  } finally {
    // await client.close()
  }
})