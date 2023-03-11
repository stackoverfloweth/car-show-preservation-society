import { MockFunction } from '@/services/mocker'

export const randomImage: MockFunction<string, []> = function() {
  return '/vite.svg'
}