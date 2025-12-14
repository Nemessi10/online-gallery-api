import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

type CloudinaryDestroyResult = {
  result: 'ok' | 'not found';
};

@Injectable()
export class CloudinaryService {
  constructor(private readonly config: ConfigService) {
    cloudinary.config({
      cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get('CLOUDINARY_API_KEY'),
      api_secret: this.config.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'online-gallery' },
        (error, result) => {
          if (error) {
            reject(new Error(error.message || 'Cloudinary upload error'));
          } else if (!result) {
            reject(new Error('No result returned from Cloudinary'));
          } else {
            resolve(result);
          }
        },
      );

      const buffer = (file as { buffer?: Buffer }).buffer;
      if (!buffer) {
        reject(new Error('File buffer is missing'));
        return;
      }
      uploadStream.end(buffer);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    const result = (await cloudinary.uploader.destroy(
      publicId,
    )) as CloudinaryDestroyResult;

    if (result.result !== 'ok') {
      throw new Error('Cloudinary failed to delete image');
    }
  }
}
