import { v2 as cloudinary } from 'cloudinary'
import { IImage, ImageRequest } from '@/models'

export async function uploadMedia(request: ImageRequest & { file: string }): Promise<IImage | undefined> {
  const cloudinaryResult = await cloudinary.uploader.upload(request.file)

  return {
    cloudinaryId: cloudinaryResult.public_id,
    version: cloudinaryResult.version,
    width: cloudinaryResult.width,
    height: cloudinaryResult.height,
    format: cloudinaryResult.format,
    resource: cloudinaryResult.resource_type,
    bytes: cloudinaryResult.bytes,
    type: cloudinaryResult.type,
  } as IImage
}

export function isValidImageRequest(value: unknown): value is ImageRequest & { file: string } {
  return !!value && typeof value === 'object' && 'file' in value && typeof value.file === 'string'
}