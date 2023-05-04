import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from 'netlify/utilities/env'

export const client = new MongoClient(env().mongodbUrl, {
  maxIdleTimeMS: 10000,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})