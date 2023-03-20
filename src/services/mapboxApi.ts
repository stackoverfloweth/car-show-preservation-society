import { MapBoxPlacesOptions } from '@/models/api'
import { Api } from '@/services/api'
import { env } from '@/utilities'

export class MapBoxApi extends Api {
  public constructor() {
    super({
      baseUrl: 'https://api.mapbox.com/geocoding/v5',
    })

    this.apiHeaders = { pk: env().mapBoxToken }
  }

  public getLocations(search: string, options: MapBoxPlacesOptions): Promise<Event | undefined> {
    return this.get(`/mapbox.places/${search}.json`, { params: { ...options, 'access_token': env().mapBoxToken } })
  }
}

export const mapBoxApi = new MapBoxApi()