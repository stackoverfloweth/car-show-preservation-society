import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { VotingCategoryRequest, VotingCategoryResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api<VotingCategoryRequest>('POST', 'voting-category-suggest/:eventId', ([eventId]) => async () => {
  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<VotingCategoryResponse>('voting-category')

    const insert: VotingCategoryResponse[] = [
      { eventId, _id: new ObjectId(), name: 'BEST IN SHOW', featured: true },
      { eventId, _id: new ObjectId(), name: 'CLUB CHOICE', featured: true, membersOnly: true },
      {
        eventId, _id: new ObjectId(), name: 'EARLY CUSTOM 1935 thru 1948', description: `Must be early tradition style custom: Vehicle must be chopped, channeled or
      sectioned, have over ten (10) modifications and a silhouette change. modifications
      should be made using body parts appropriate to the era, early type induction or
      carbureted motor, White wall tires, Steel wheels and early style type interior`,
      },
      {
        eventId, _id: new ObjectId(), name: 'EARLY CUSTOM 1949 thru 1954', description: `Must be early tradition style custom: Body modifications should be made using body
      parts appropriate to the era, early type induction or carbureted motor, White wall tires,
      Steel wheels and early style type interior. Will be broken down to hardtop or
      convertible.`,
      },
      {
        eventId, _id: new ObjectId(), name: 'EARLY CUSTOM 1955 thru 1964', description: `Must be early tradition style custom: Body modifications should be made using body
      parts appropriate to the era, early type induction or carbureted motor, White wall tires,
      Steel wheels and early style type interior. Will be broken down to hardtop or
      convertible.`,
      },
      { eventId, _id: new ObjectId(), name: 'CUSTOM 4X4', description: 'Automotive bodies equipped with 4x4 suspensions, for street only' },
      { eventId, _id: new ObjectId(), name: 'EXOTIC SPORTS', description: 'Limited production two (2) passenger vehicle, i.e. Ferrari, McLaren, Porsche, etc.' },
    ]

    const result = await collection.insertMany(insert)

    return {
      statusCode: 201,
      body: JSON.stringify(result.insertedIds),
    }
  } finally {
    await client.close()
  }
})
