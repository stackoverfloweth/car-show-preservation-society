import { User } from '@/models/user'
import { Api } from '@/services/api'
import { mocker } from '@/services/mocker'

export class UsersApi extends Api {
  protected override routePrefix = '/users'

  public async getUser(userId: string): Promise<User | undefined> {
    return await Promise.resolve(mocker.create('user', [{ userId }]))
  }

  public async getUsersFromClub(clubId: string): Promise<User[]> {
    return await Promise.resolve(mocker.createMany('user', 5))
  }

  public async updateUser(user: User): Promise<User> {
    return await Promise.resolve(mocker.create('user', [user]))
  }
}
