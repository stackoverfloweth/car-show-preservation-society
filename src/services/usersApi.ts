import { Club } from '@/models'
import { IUser, User } from '@/models/user'
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

  public async updateUser(user: IUser): Promise<User> {
    return await Promise.resolve(mocker.create('user', [user]))
  }

  public async getUserClubs(userId: string): Promise<Club[]> {
    return await Promise.resolve(mocker.createMany('club', mocker.create('number', [0, 5])))
  }

  public async isMemberOfClub(userId: string, clubId: string): Promise<boolean> {
    const clubs = await this.getUserClubs(userId)

    return clubs.some(club => club.clubId === clubId)
  }
}
