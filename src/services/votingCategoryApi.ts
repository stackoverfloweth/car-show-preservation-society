import { VotingCategoryRequest } from '@/models/api'
import { VotingCategory } from '@/models/votingCategory'
import { Api, mocker } from '@/services'

export class VotingCategoriesApi extends Api {
  protected override routePrefix = '/votingCategories'

  public async getVotingCategories(): Promise<VotingCategory[]> {
    return await Promise.resolve(mocker.createMany('votingCategory', 5))
  }

  public async createVotingCategory(request: VotingCategoryRequest): Promise<VotingCategory> {
    return await Promise.resolve(mocker.create('votingCategory', [request]))
  }
}
