import { Location } from '@/models'
import { MapBoxFeatureResponse } from '@/models/api'
import { MapFunction } from '@/services/mapper'

export const mapMapBoxFeatureResponseToLocation: MapFunction<MapBoxFeatureResponse, Location> = function(source) {
  return {
    place: source.place_name,
    coordinates: source.center,
  }
}