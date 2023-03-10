export function intersects(first: unknown[], ...rest: unknown[][]): boolean {
  return first.some(firstValue => rest.every(restArray => restArray.includes(firstValue)))
}

export function groupBy<T, K extends keyof T>(source: T[], key: K): Map<T[K], T[]> {
  return source.reduce((result, value) => {
    const mapKey = value[key]
    const initial = result.get(mapKey) ?? []

    initial.push(value)

    result.set(mapKey, initial)

    return result
  }, new Map<T[K], T[]>())
}

export function separate<T>(source: T[], filter: (value: T) => boolean): [found: T[], notFound: T[]] {
  return source.reduce<[T[], T[]]>(([found, notFound], value) => {
    if (filter(value)) {
      found.push(value)
    } else {
      notFound.push(value)
    }

    return [found, notFound]
  }, [[], []])
}