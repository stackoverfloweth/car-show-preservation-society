import { VotingCategoryRequest } from '@/models/api'
import { VotingCategory } from '@/models/votingCategory'
import { Api, mocker } from '@/services'

export class VotingCategoriesApi extends Api {
  protected override routePrefix = '/votingCategories'

  public async getVotingCategory(votingCategoryId: string): Promise<VotingCategory> {
    return await Promise.resolve(mocker.create('votingCategory', [{ votingCategoryId }]))
  }

  public async getVotingCategories(eventId: string): Promise<VotingCategory[]> {
    return await Promise.resolve([
      mocker.create('votingCategory', [{ eventId, featured: true, automaticEntry: true }]),
      ...mocker.createMany('votingCategory', 50, [{ eventId }]),
    ])
  }

  public async suggestVotingCategories(eventId: string): Promise<VotingCategory[]> {
    return await Promise.resolve(mocker.createMany('votingCategory', 5, [{ eventId }]))
  }

  public async createVotingCategory(request: VotingCategoryRequest): Promise<VotingCategory> {
    return await Promise.resolve(mocker.create('votingCategory', [request]))
  }

  public async updateVotingCategory(request: VotingCategory): Promise<VotingCategory> {
    return await Promise.resolve(mocker.create('votingCategory', [request]))
  }

  public async deleteVotingCategory(votingCategoryId: string): Promise<void> {
    await Promise.resolve(votingCategoryId)
  }

  public async deleteAllVotingCategories(eventId: string): Promise<void> {
    await Promise.resolve(eventId)
  }
}
