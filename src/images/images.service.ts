import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Express } from 'express';

@Injectable()
export class ImagesService {
  constructor(private readonly cloudinary: CloudinaryService) {}

  async uploadImage(file: Express.Multer.File) {
    return this.cloudinary.uploadImage(file);
  }
}
