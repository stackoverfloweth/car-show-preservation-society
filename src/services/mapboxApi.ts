import { createActions } from '@prefecthq/vue-compositions'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Location } from '@/models'
import { MapBoxPlaceResponse, MapBoxPlacesOptions } from '@/models/api'
import { Api, mapper } from '@/services'
import { env } from '@/utilities'

export class MapBoxApi extends Api {
  public constructor() {
    super({
      baseUrl: 'https://api.mapbox.com/geocoding/v5',
    })
  }

  public override get<T, R = AxiosResponse<T>>(route?: string, config?: AxiosRequestConfig): Promise<R> {
    const path = this.combinePath(route)
    const params = { ...config?.params, 'access_token': env().mapBoxToken }

    return this.instance().get(path, { ...config, params })
  }

  public getLocations(search: string, options: MapBoxPlacesOptions = {}): Promise<Location[]> {
    return this.get<MapBoxPlaceResponse>(`/mapbox.places/${search}.json`, { params: options })
      .then(({ data }) => mapper.map('MapBoxFeatureResponse', data.features, 'Location'))
  }
}

export const mapBoxApi = createActions(new MapBoxApi())