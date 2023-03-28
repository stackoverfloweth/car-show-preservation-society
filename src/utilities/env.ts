export type Env = {
  mapBoxToken: string,
  cloudFlareAccount: string,
  cloudFlareToken: string,
}

export function env(): Env {
  return {
    mapBoxToken: import.meta.env.VITE_MAPBOX_TOKEN,
    cloudFlareAccount: import.meta.env.VITE_CLOUD_FLARE_ACCOUNT,
    cloudFlareToken: import.meta.env.VITE_CLOUD_FLARE_TOKEN,
  }
}