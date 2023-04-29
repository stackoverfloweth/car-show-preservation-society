export type Env = {
  baseApiUrl: string,
  cloudinaryName: string,
  mapBoxToken: string,
  password: string,
  prod: boolean,
}

export function env(): Env {
  return {
    baseApiUrl: import.meta.env.VITE_BASE_API_URL,
    cloudinaryName: import.meta.env.VITE_CLOUDINARY_NAME,
    mapBoxToken: import.meta.env.VITE_MAPBOX_TOKEN,
    password: import.meta.env.VITE_PASSWORD,
    prod: !!import.meta.env.PROD,
  }
}