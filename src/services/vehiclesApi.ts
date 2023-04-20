import { Image } from '@/models'
import { ImageRequest, VehicleRequest } from '@/models/api'
import { Vehicle } from '@/models/vehicle'
import { Api, mocker } from '@/services'

export class VehiclesApi extends Api {
  protected override routePrefix = '/vehicles'

  public async getVehicles(): Promise<Vehicle[]> {
    return await Promise.resolve(mocker.createMany('vehicle', mocker.create('number', [1, 5])))
  }

  public async getVehicle(vehicleId: string): Promise<Vehicle | undefined> {
    return await Promise.resolve(mocker.create('vehicle', [{ vehicleId }]))
  }

  public async createVehicle(request: VehicleRequest): Promise<Vehicle> {
    return await Promise.resolve(mocker.create('vehicle', [request]))
  }

  public async getVehicleImages(vehicleId: string): Promise<Image[]> {
    return await Promise.resolve(mocker.createMany('image', mocker.create('number', [0, 10])))
  }

  public async deleteVehicleImage(imageId: string): Promise<void> {
    await Promise.resolve(imageId)
  }

  public async createVehicleImage(request: ImageRequest): Promise<Image> {
    return await Promise.resolve(mocker.create('image', [request]))
  }
}
