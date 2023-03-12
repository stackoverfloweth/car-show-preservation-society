import { User } from '@/models/user'
import { Api } from '@/services/api'
import { mocker } from '@/services/mocker'

export class UsersApi extends Api {
  protected override routePrefix = '/users'

  public async getUser(userId: string): Promise<User> {
    return await Promise.resolve(mocker.create('user', [{ userId }]))
  }
}
