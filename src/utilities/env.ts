export type Env = {
  baseApiUrl: string,
  cloudinaryName: string,
  mapBoxToken: string,
}

export function env(): Env {
  return {
    baseApiUrl: import.meta.env.VITE_BASE_API_URL,
    cloudinaryName: import.meta.env.VITE_CLOUDINARY_NAME,
    mapBoxToken: import.meta.env.VITE_MAPBOX_TOKEN,
  }
}