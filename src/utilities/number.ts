export function toOrdinal(value: number): string {
  return `${value}${getOrdinal(value)}`
}

export function getOrdinal(value: number): string {
  return ['st', 'nd', 'rd'][((value + 90) % 100 - 10) % 10 - 1] || 'th'
}