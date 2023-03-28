import { createActions } from '@prefecthq/vue-compositions'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Location } from '@/models'
import { Api, mapper } from '@/services'
import { env } from '@/utilities'

export class CloudFlareApi extends Api {
  public constructor() {
    super({
      baseUrl: 'https://api.cloudFlare.com/geocoding/v5',
      token: '123',
    })
  }

  public uploadImage(request: FormData): Promise<void> {
    const account = env().cloudFlareAccount
    return this.post(`https://api.cloudflare.com/client/v4/accounts/${account}/images/v1`, request)
  }
}

export const cloudFlareApi = createActions(new CloudFlareApi())