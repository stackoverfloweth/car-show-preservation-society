export const vowels: string[] = ['a', 'e', 'i', 'o', 'u', 'y']

export const pluralize = (word: string): string => {
  if (word.endsWith('s')) {
    return word
  }

  if (word.match(/(ss|ish|ch|x|us)$/)) {
    word += 'e'

  } else if (word.endsWith('y') && !vowels.includes(word.charAt(word.length - 2))) {
    word = word.slice(0, word.length - 1)
    word += 'ie'
  }

  return `${word}s`
}

export function toPluralString(word: string, count?: number): string {
  if (count === 1) {
    return word
  }

  return pluralize(word)
}

export function formatPhoneNumber(phoneNumber?: string): string {
  if (!phoneNumber) {
    return ''
  }

  const cleaned = `${ phoneNumber }`.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)

  if (match) {
    return `(${ match[1] }) ${ match[2] }-${ match[3]}`
  }

  return ''
}

export function capitalize<T extends string>(value: T): Capitalize<T> {
  const firstLetterCapitalized = value.charAt(0).toUpperCase()
  const rest = value.slice(1)

  return `${firstLetterCapitalized}${rest}` as Capitalize<T>
}

export function unKebabCase(value: string): string {
  return value.split('-').map(word => capitalize(word)).join(' ')
}