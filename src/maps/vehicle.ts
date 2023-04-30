import { Vehicle } from '@/models'
import { VehicleRequest, VehicleResponse } from '@/models/api'
import { MapFunction } from '@/services/mapper'

export const mapVehicleResponseToVehicle: MapFunction<VehicleResponse, Vehicle> = function(source) {
  return {
    vehicleId: source._id.toString(),
    userId: source.userId,
    make: source.make,
    model: source.model,
    year: source.year,
    description: source.description,
    color: source.color,
    modificationCount: source.modificationCount,
    modifiedAppearance: source.modifiedAppearance,
    image: this.map('ImageResponse', source.image, 'Image'),
    images: source.images ? this.map('ImageResponse', source.images, 'Image') : undefined,
  }
}

export const mapVehicleToVehicleRequest: MapFunction<Vehicle, VehicleRequest> = function(source) {
  return {
    vehicleId: source.vehicleId,
    userId: source.userId,
    make: source.make,
    model: source.model,
    year: source.year,
    description: source.description,
    color: source.color,
    modificationCount: source.modificationCount,
    modifiedAppearance: source.modifiedAppearance,
    image: undefined,
  }
}