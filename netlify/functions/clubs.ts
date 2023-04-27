import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { ClubRequest, IClub, ImageRequest } from '@/models'
import { Api, withCollection } from 'netlify/utilities'
import { isValidImageRequest, uploadMedia } from 'netlify/utilities/images'

const api = new Api()

export const handler: Handler = (event, context) => api.execute(event, context)

api.get('/clubs', () => async () => {
  const rows = await withCollection<IClub, IClub[]>('club', async (collection) => {
    return await collection.find({ $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] }).toArray()
  })

  return {
    statusCode: 200,
    body: JSON.stringify(rows),
  }
})

api.post('/clubs', (args, body) => async () => {
  const clubLogo = hasValidImageRequest(body) ? await uploadMedia(body.clubLogo) : undefined
  const inserted = await withCollection<IClub, ObjectId>('club', async (collection) => {
    const result = await collection.insertOne({
      ...body,
      clubLogo,
    } as IClub)

    return result.insertedId
  })

  return {
    statusCode: 201,
    body: JSON.stringify(inserted),
  }
})

api.get('clubs/:clubId', ([clubId]) => async () => {
  const club = await withCollection<IClub, IClub | null>('club', async (collection) => {
    return await collection.findOne({ _id: new ObjectId(clubId) })
  })

  if (!club) {
    return { statusCode: 404 }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(club),
  }
})

api.put('/clubs/:clubId', ([clubId], body) => async () => {
  const clubLogo = hasValidImageRequest(body) ? await uploadMedia(body.clubLogo) : undefined
  const acknowledged = await withCollection<IClub, boolean>('club', async (collection) => {
    const result = await collection.updateOne({ _id: new ObjectId(clubId) }, {
      $set: {
        ...body,
        clubLogo,
      } as IClub,
    })

    return result.acknowledged
  })


  return { statusCode: acknowledged ? 202 : 400 }
})

api.delete('/clubs/:clubId', ([clubId]) => async () => {
  const deletedCount = await withCollection<IClub, number>('club', async (collection) => {
    const result = await collection.deleteOne({ _id: new ObjectId(clubId) })

    return result.deletedCount
  })

  return { statusCode: deletedCount === 1 ? 202 : 400 }
})

function hasValidImageRequest(value: unknown): value is ClubRequest & { clubLogo: ImageRequest & { file: string } } {
  return !!value && typeof value === 'object' && 'clubLogo' in value && isValidImageRequest(value.clubLogo)
}