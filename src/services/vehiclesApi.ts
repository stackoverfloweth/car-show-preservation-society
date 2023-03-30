import { VehicleRequest } from '@/models/api'
import { Vehicle } from '@/models/vehicle'
import { Api, mocker } from '@/services'

export class VehiclesApi extends Api {
  protected override routePrefix = '/vehicles'

  public async getVehicles(): Promise<Vehicle[]> {
    return await Promise.resolve(mocker.createMany('vehicle', 5))
  }

  public async getVehicle(vehicleId: string): Promise<Vehicle | undefined> {
    return await Promise.resolve(mocker.create('vehicle', [{ vehicleId }]))
  }

  public async createVehicle(request: VehicleRequest): Promise<Vehicle> {
    return await Promise.resolve(mocker.create('vehicle', [request]))
  }
}
