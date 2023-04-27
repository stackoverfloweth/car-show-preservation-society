import { Collection, MongoClient, ServerApiVersion, Document } from 'mongodb'
import { env } from 'netlify/utilities'

const client = new MongoClient(env().mongodbUrl, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

export type WithCollectionCallback<T extends Document, R> = (collection: Collection<T>) => Promise<R>

export async function withCollection<T extends Document, R>(collectionName: string, callback: WithCollectionCallback<T, R>): Promise<R> {
  try {
    await client.connect()

    const db = client.db('csps')
    const collection = db.collection<T>(collectionName)

    return await callback(collection)
  } finally {
    await client.close()
  }
}