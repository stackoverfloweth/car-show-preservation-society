import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { BallotResponse, VoteRequest } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api<VoteRequest[]>('GET', 'ballots-set-votes/:ballotId', ([ballotId], body) => async () => {
  if (!body || body.length === 0) {
    return { statusCode: 400 }
  }

  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<BallotResponse>('ballot')

    const result = await collection.updateOne(
      { _id: new ObjectId(ballotId) },
      { votes: body },
    )

    return { statusCode: result.acknowledged ? 202 : 400 }
  } finally {
    // await client.close()
  }
})