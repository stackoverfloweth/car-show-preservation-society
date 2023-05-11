export type Env = {
  baseApiUrl: string,
  cloudinaryName: string,
  mapBoxToken: string,
  netlifyIdentityUrl: string,
  prod: boolean,
}

export function env(): Env {
  return {
    baseApiUrl: import.meta.env.VITE_BASE_API_URL,
    cloudinaryName: import.meta.env.VITE_CLOUDINARY_NAME,
    mapBoxToken: import.meta.env.VITE_MAPBOX_TOKEN,
    netlifyIdentityUrl: import.meta.env.VITE_NETLIFY_IDENTITY_URL,
    prod: import.meta.env.PROD,
  }
}