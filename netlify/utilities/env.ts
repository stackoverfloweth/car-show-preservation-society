export type Env = {
  mongodbUrl: string,
  cloudinaryUrl: string,
  cloudinaryPreset: string,
  cloudinarySecret: string,
}

export function env(): Env {
  return {
    mongodbUrl: process.env.MONGODB_URI ?? '',
    cloudinaryUrl: process.env.CLOUDINARY_URL ?? '',
    cloudinaryPreset: process.env.CLOUDINARY_PRESET ?? '',
    cloudinarySecret: process.env.CLOUDINARY_SECRET ?? '',
  }
}