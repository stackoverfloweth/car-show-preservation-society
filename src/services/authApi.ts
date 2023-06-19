import { AxiosHeaders, RawAxiosRequestHeaders } from 'axios'
import { Api, ApiConfig } from '@/services/api'
import { composeAuthHeaders } from '@/services/auth'

export class AuthApi<T extends ApiConfig = ApiConfig> extends Api<T> {
  protected override composeHeaders(): RawAxiosRequestHeaders | AxiosHeaders {
    return composeAuthHeaders()
  }
}