import { VotingCategoryRequest, VotingCategoryResponse } from '@/models/api'
import { VotingCategory } from '@/models/votingCategory'
import { Api, mapper, mocker } from '@/services'

export class VotingCategoriesApi extends Api {
  public getVotingCategory(votingCategoryId: string): Promise<VotingCategory | undefined> {
    return this.get<VotingCategoryResponse | undefined>(`voting-category-get-by-id/${votingCategoryId}`)
      .then(({ data }) => mapper.map('VotingCategoryResponse', data, 'VotingCategory'))
  }

  public getVotingCategories(eventId: string): Promise<VotingCategory[]> {
    return this.get<VotingCategoryResponse[]>(`voting-category-get-list/${eventId}`)
      .then(({ data }) => mapper.map('VotingCategoryResponse', data, 'VotingCategory'))
  }

  public async getVotingCategoriesByRegistration(registrationId: string): Promise<VotingCategory[]> {
    return await Promise.resolve([
      mocker.create('votingCategory', [{ featured: true, automaticEntry: true }]),
      ...mocker.createMany('votingCategory', 50),
    ])
  }

  public suggestVotingCategories(eventId: string): Promise<string[]> {
    return this.post<string[]>(`voting-category-suggest/${eventId}`)
      .then(({ data }) => data)
  }

  public createVotingCategory(request: VotingCategoryRequest): Promise<string> {
    return this.post<string>('voting-category-create', request)
      .then(({ data }) => data)
  }

  public updateVotingCategory(request: VotingCategoryRequest): Promise<VotingCategory> {
    return this.put(`voting-category-update/${request.votingCategoryId}`, request)
  }

  public deleteVotingCategory(votingCategoryId: string): Promise<void> {
    return this.delete(`voting-category-delete/${votingCategoryId}`)
  }

  public deleteVotingCategories(votingCategoryIds: string[]): Promise<void> {
    return this.post('voting-category-delete-many', { votingCategoryIds })
  }

  public deleteAllVotingCategories(eventId: string): Promise<void> {
    return this.delete(`voting-category-delete-all/${eventId}`)
  }
}
