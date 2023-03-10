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