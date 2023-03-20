import { MapBoxType } from '@/models/api/mapBoxType'

export type MapBoxFeatureResponse = {
  id: string,
  center: [latitude: number, longitude: number],
  place_type: MapBoxType[],
  place_name: string,
  relevance: number,
  text: string,
}