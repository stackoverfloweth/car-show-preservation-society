import { Handler } from '@netlify/functions'
import { IClub } from '@/models'
import { Api, env } from 'netlify/utilities'
import { client } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('GET', 'clubs-get-list', () => async () => {
  try {
    await client.connect()

    const db = client.db(env().mongodbName)
    const collection = db.collection<IClub>('club')

    const clubs = await collection.find({ $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] }).toArray()

    return {
      statusCode: 200,
      body: JSON.stringify(clubs),
    }
  } finally {
    await client.close()
  }
})