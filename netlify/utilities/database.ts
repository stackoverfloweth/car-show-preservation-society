import { Collection, MongoClient, ServerApiVersion, Document } from 'mongodb'

const client = new MongoClient(process.env.VITE_MONGODB_URI ?? '', {
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