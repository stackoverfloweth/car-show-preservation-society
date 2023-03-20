export type Env = {
  mapBoxToken: string,
}

export function env(): Env {
  return {
    mapBoxToken: import.meta.env.VITE_MAPBOX_TOKEN,
  }
}