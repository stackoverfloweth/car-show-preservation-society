import { Handler } from '@netlify/functions'
import { Api, env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('POST', 'user-webhook', (args, body) => async () => {
  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection('user')

    await collection.insertOne({
      ...args, body, env: env().netlifyWebhookSecret,
    })

    return { statusCode: 200 }
  } finally {
    await client.close()
  }
})