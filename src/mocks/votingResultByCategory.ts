import { VotingResultsByCategory } from '@/models'
import { MockFunction } from '@/services/mocker'

export const randomVotingResultsByCategory: MockFunction<VotingResultsByCategory, [Partial<VotingResultsByCategory>?]> = function(overrides = {}) {
  const votingCategoryId = this.create('id')
  const value: VotingResultsByCategory = {
    results: [],
    votingCategory: this.create('votingCategory', [{ votingCategoryId }]),
  }

  for (let index = 1; index <= this.create('number', [5, 20]); index ++) {
    const isTie = this.create('number', [0, 9]) > 7

    if (isTie) {
      value.results.push(this.create('votingResult', [{ votingCategoryId, place: `T${index}` }]))
      value.results.push(this.create('votingResult', [{ votingCategoryId, place: `T${index}` }]))
    } else {
      value.results.push(this.create('votingResult', [{ votingCategoryId, place: `${index}` }]))
    }
  }

  return {
    ...value,
    ...overrides,
  }
}