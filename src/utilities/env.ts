export type Env = {
  baseApiUrl: string,
  mapBoxToken: string,
}

export function env(): Env {
  return {
    baseApiUrl: import.meta.env.VITE_BASE_API_URL,
    mapBoxToken: import.meta.env.VITE_MAPBOX_TOKEN,
  }
}