export function toOrdinal(value: number): string {
  return `${value}${['st', 'nd', 'rd'][((value + 90) % 100 - 10) % 10 - 1] || 'th'}`
}