import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { ClubResponse, EventResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'


export const handler: Handler = Api('GET', 'events-get-by-id/:id', ([eventId]) => async () => {
  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection<EventResponse>('event')
    const event = await collection.findOne(
      { _id: new ObjectId(eventId) },
      { projection: { images: 0 } },
    )

    if (!event) {
      return { statusCode: 404 }
    }

    if (!event.contactUserId) {
      const clubCollection = db.collection<ClubResponse>('club')
      const club = await clubCollection.findOne({ _id: new ObjectId(event.clubId) })

      event.contactUserId = club?.contactUserId
    }

    return {
      statusCode: 200,
      body: JSON.stringify(event),
    }
  } finally {
    await client.close()
  }
})