import { MapBoxType } from '@/models/api/mapBoxType'

export type MapBoxPlacesOptions = {
  access_token?: string,
  autocomplete?: boolean,
  bbox?: number,
  country?: string,
  fuzzyMatch?: boolean,
  limit?: number,
  proximity?: string,
  types?: MapBoxType | `${MapBoxType},${MapBoxType}` | `${MapBoxType},${MapBoxType},${MapBoxType}` | `${MapBoxType},${MapBoxType},${MapBoxType},${MapBoxType}`,
}