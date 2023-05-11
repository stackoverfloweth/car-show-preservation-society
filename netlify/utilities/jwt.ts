export function getParsedJwt<T extends object = Record<string, string | number>>(
  token: string,
): T | undefined {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return undefined
  }
}