import { addDays } from 'date-fns'
import { MockFunction } from '@/services/mocker'

export const randomDate: MockFunction<Date, [Date?, Date?]> = function(start, end) {
  if (!start) {
    start = new Date(0)
  }

  if (!end) {
    end = addDays(start, this.create('number', [1, 365]))
  }

  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}