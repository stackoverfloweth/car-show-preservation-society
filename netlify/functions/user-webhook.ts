import { Handler } from '@netlify/functions'
import { Api, env } from 'netlify/utilities'
import { getParsedJwt } from 'netlify/utilities/jwt'
import { getClient } from 'netlify/utilities/mongodbClient'

export const handler: Handler = Api('POST', 'user-webhook', (args, body) => async (event) => {
  const client = await getClient()

  try {
    const db = client.db(env().mongodbName)
    const collection = db.collection('user')
    const token = event.headers['X-Webhook-Signature']
    if (!token) {
      return { statusCode: 400 }
    }

    await collection.insertOne({
      token,
    })

    const decoded = getParsedJwt(token)

    await collection.insertOne({
      decoded,
    })

    return { statusCode: 200 }
  } finally {
    await client.close()
  }
})