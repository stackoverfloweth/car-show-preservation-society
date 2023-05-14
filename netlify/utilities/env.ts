export type Env = {
  url: string,
  mongodbUrl: string,
  mongodbName: string,
  cloudinaryUrl: string,
  cloudinaryPreset: string,
  cloudinarySecret: string,
  netlifyWebhookSecret: string,
  netlifyEmailsSecret: string,
}

export function env(): Env {
  return {
    url: process.env.URL ?? '',
    mongodbUrl: process.env.MONGODB_URI ?? '',
    mongodbName: process.env.MONGODB_NAME ?? '',
    cloudinaryUrl: process.env.CLOUDINARY_URL ?? '',
    cloudinaryPreset: process.env.CLOUDINARY_PRESET ?? '',
    cloudinarySecret: process.env.CLOUDINARY_SECRET ?? '',
    netlifyWebhookSecret: process.env.NETLIFY_WEBHOOK_SECRET ?? '',
    netlifyEmailsSecret: process.env.NETLIFY_EMAILS_SECRET ?? '',
  }
}