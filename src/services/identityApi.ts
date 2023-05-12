import GoTrue, { User } from 'gotrue-js'
import { Api } from '@/services/api'
import { env } from '@/utilities'

const auth = new GoTrue({
  APIUrl: env().netlifyIdentityUrl,
  audience: '',
  setCookie: true,
})

export class IdentityApi extends Api {
  public constructor() {
    super({
      baseUrl: env().netlifyIdentityUrl,
    })
  }

  public signUp(emailAddress: string, password: string): Promise<User> {
    return auth.signup(emailAddress, password)
  }

  public login(emailAddress: string, password: string, remember: boolean): Promise<User> {
    return auth.login(emailAddress, password, remember)
  }

  public recovery(emailAddress: string): Promise<void> {
    return auth.requestPasswordRecovery(emailAddress)
  }

  public currentUser(): User | null {
    return auth.currentUser()
  }
}

export const identifyApi = new IdentityApi()