import { MapBoxFeatureResponse } from '@/models/api/mapBoxFeatureResponse'

export type MapBoxPlaceResponse = {
  attribution: string,
  features: MapBoxFeatureResponse[],
  query: string[],
}

