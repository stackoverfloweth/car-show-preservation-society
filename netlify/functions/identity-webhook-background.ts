import type { BackgroundHandler } from '@netlify/functions'
import { User } from 'gotrue-js'
import { env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'
import { verifyJWS } from 'netlify/utilities/security'

export const handler: BackgroundHandler = async function(event) {
  const client = await getClient()

  try {
    const signature = event.headers['x-webhook-signature']
    const db = client.db(env().mongodbName)
    const collection = db.collection('user')

    if (!event.body || !verifyJWS(signature)) {
      return
    }

    const user = getUser(event.body)

    if (!user) {
      return
    }

    await collection.insertOne({
      identityId: user.id,
      email: user.email,
    })

  } finally {
    await client.close()
  }
}

function getUser(body: string): User | undefined {
  try {
    const { user } = JSON.parse(body)

    return user
  } catch (exception) {
    return undefined
  }
}