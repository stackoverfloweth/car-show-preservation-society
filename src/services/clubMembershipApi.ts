import { User } from '@/models'
import { Api, mocker } from '@/services'

export class ClubMembershipApi extends Api {
  protected override routePrefix = '/club-membership'

  public async joinClub(clubId: string, userId: string, message?: string): Promise<void> {
    await Promise.resolve({ clubId, userId, message })
  }

  public async leaveClub(clubId: string, userId: string): Promise<void> {
    await Promise.resolve({ clubId, userId })
  }

  public async getClubAdmins(clubId: string): Promise<User[]> {
    return await Promise.resolve(mocker.createMany('user', mocker.create('number', [1, 5])))
  }

  public async getClubMembers(clubId: string): Promise<User[]> {
    return await Promise.resolve(mocker.createMany('user', mocker.create('number', [0, 15])))
  }

  public async getClubPendingMembers(clubId: string): Promise<string[]> {
    // if user isn't admin, this should return []
    return await Promise.resolve(mocker.createMany('email', mocker.create('number', [0, 2])))
  }

  public async deleteClubMember(clubId: string, member: User): Promise<void> {
    await Promise.resolve({ clubId, member })
  }
}
