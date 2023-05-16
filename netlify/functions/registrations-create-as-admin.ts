import { Handler } from '@netlify/functions'
import { ObjectId } from 'mongodb'
import { NewUserRegistrationRequest, RegistrationResponse, VehicleResponse } from '@/models/api'
import { Api, env } from 'netlify/utilities'
import { getClient } from 'netlify/utilities/mongodbClient'

// todo: rework after user comes from netlify
// todo: needs to send an email to have user complete setup
export const handler: Handler = Api<NewUserRegistrationRequest>('POST', 'registrations-create-as-admin', (args, body) => async () => {
  if (!body) {
    return { statusCode: 400 }
  }

  const client = await getClient()

  try {
    // const db = client.db(env().mongodbName)
    // const users = db.collection<UserResponse>('user')
    // const vehicles = db.collection<VehicleResponse>('vehicle')
    // const collection = db.collection<Omit<RegistrationResponse, 'user' | 'vehicle'>>('registration')

    // const { registrationId, user, vehicle, ...rest } = body
    // const { userId, image: userImage, ...userValues } = user
    // const { vehicleId, image: vehicleImage, ...vehicleValues } = vehicle

    // const newUser = await users.insertOne({
    //   ...userValues,
    //   _id: new ObjectId(),
    // })

    // const newVehicle = await vehicles.insertOne({
    //   ...vehicleValues,
    //   _id: new ObjectId(),
    //   userId: newUser.insertedId.toString(),
    // })

    // const result = await collection.insertOne({
    //   ...rest,
    //   userId: newUser.insertedId.toString(),
    //   vehicleId: newVehicle.insertedId.toString(),
    //   registrationCode: 'R123',
    //   registrationDate: new Date(),
    //   _id: new ObjectId(),
    // })

    return {
      statusCode: 201,
      // body: JSON.stringify(result.insertedId),
    }
  } finally {
    await client.close()
  }
})
