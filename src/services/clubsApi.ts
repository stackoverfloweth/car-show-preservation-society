import { Image, User } from '@/models'
import { ClubRequest, ClubsFilter, ClubsSort, ImageRequest } from '@/models/api'
import { Club, IClub } from '@/models/club'
import { Api, mocker } from '@/services'

export class ClubsApi extends Api {
  protected override routePrefix = '/clubs'

  public async getClubs(filter?: ClubsFilter, sort?: ClubsSort): Promise<Club[]> {
    return await Promise.resolve(mocker.createMany('club', 5))
  }

  public async getClub(clubId: string): Promise<Club | undefined> {
    return await Promise.resolve(mocker.create('club', [{ clubId }]))
  }

  public async createClub(request: ClubRequest): Promise<Club> {
    return await Promise.resolve(mocker.create('club', [request]))
  }

  public async updateClub(club: IClub): Promise<Club> {
    return await Promise.resolve(mocker.create('club', [club]))
  }

  public async joinClub(clubId: string, userId: string, message?: string): Promise<void> {
    await Promise.resolve({ clubId, userId, message })
  }

  public async leaveClub(clubId: string, userId: string): Promise<void> {
    await Promise.resolve({ clubId, userId })
  }

  public async getClubImages(clubId: string): Promise<Image[]> {
    return await Promise.resolve(mocker.createMany('image', mocker.create('number', [0, 50])))
  }

  public async deleteClubImage(imageId: string): Promise<void> {
    await Promise.resolve(imageId)
  }

  public async createClubImage(request: ImageRequest): Promise<Image> {
    return await Promise.resolve(mocker.create('image', [request]))
  }

  public async getClubAdmins(clubId: string): Promise<User[]> {
    return await Promise.resolve(mocker.createMany('user', mocker.create('number', [1, 5])))
  }

  public async getClubMembers(clubId: string): Promise<User[]> {
    return await Promise.resolve(mocker.createMany('user', mocker.create('number', [0, 15])))
  }
}
