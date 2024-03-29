import { MapFunction } from '@/services/mapper'

export const mapStringToDate: MapFunction<string, Date> = function(source) {
  return new Date(source)
}

export const mapDateToString: MapFunction<Date, string> = function(source) {
  return source.toISOString()
}