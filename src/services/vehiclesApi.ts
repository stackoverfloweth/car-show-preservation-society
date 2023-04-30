import { Vehicle } from '@/models'
import { VehicleRequest, VehicleResponse } from '@/models/api'
import { Api, mapper } from '@/services'

export class VehiclesApi extends Api {
  public getVehicles(userId: string): Promise<Vehicle[]> {
    return this.get<VehicleResponse[]>(`vehicles-get-list/${userId}`)
      .then(({ data }) => mapper.map('VehicleResponse', data, 'Vehicle'))
  }

  public getVehicle(vehicleId: string): Promise<Vehicle | undefined> {
    return this.get<VehicleResponse | undefined>(`vehicles-get-by-id/${vehicleId}`)
      .then(({ data }) => mapper.map('VehicleResponse', data, 'Vehicle'))
  }

  public createVehicle(request: VehicleRequest): Promise<string> {
    return this.post<string>('vehicles-create', request)
      .then(({ data }) => data)
  }

  public updateVehicle(request: VehicleRequest): Promise<void> {
    return this.put(`vehicles-update/${request.vehicleId}`, request)
  }

  public deleteVehicle(vehicleId: string): Promise<void> {
    return this.delete(`vehicles-delete/${vehicleId}`)
  }
}
