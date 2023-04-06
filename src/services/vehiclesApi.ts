import { Image } from '@/models'
import { VehicleRequest } from '@/models/api'
import { Vehicle } from '@/models/vehicle'
import { Api, mocker } from '@/services'

export class VehiclesApi extends Api {
  protected override routePrefix = '/vehicles'

  public async getVehicles(): Promise<Vehicle[]> {
    return await Promise.resolve(mocker.createMany('vehicle', 1))
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
}
