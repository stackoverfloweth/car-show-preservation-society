import { AxiosHeaders, RawAxiosRequestHeaders } from 'axios'
import { Api, ApiConfig } from '@/services/api'
import { auth } from '@/services/auth'

export class AuthApi<T extends ApiConfig = ApiConfig> extends Api<T> {
  protected override composeHeaders(): RawAxiosRequestHeaders | AxiosHeaders {
    const user = auth.currentUser()
    if (!user?.token.access_token) {
      throw 'Cannot call protected route without authenticated user'
    }

    return {
      Authorization: `bearer ${user.token.access_token}`,
    }
  }
}