import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';
import { Express } from 'express';

@Injectable()
export class ImagesService {
  constructor(
    private readonly cloudinary: CloudinaryService,
    private readonly prisma: PrismaService,
  ) {}

  async uploadImage(file: Express.Multer.File) {
    const result = await this.cloudinary.uploadImage(file);

    return this.prisma.image.create({
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        filename: file.originalname,
      },
    });
  }

  async getAllImages() {
    return this.prisma.image.findMany({
      orderBy: { uploadedAt: 'desc' },
    });
  }
}
