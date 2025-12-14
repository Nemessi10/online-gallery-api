import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';
import { ImageResponseDto } from './dto/image-response.dto';
import { PaginationDto } from './dto/pagination.dto';
import { Express } from 'express';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class ImagesService {
  constructor(
    private readonly cloudinary: CloudinaryService,
    private readonly prisma: PrismaService,
  ) {}

  async uploadImage(file: Express.Multer.File): Promise<ImageResponseDto> {
    const result = await this.cloudinary.uploadImage(file);

    const image = await this.prisma.image.create({
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        filename: file.originalname,
      },
    });

    return {
      id: image.id,
      url: image.url,
      filename: image.filename,
      uploadedAt: image.uploadedAt,
    };
  }

  async getAllImages({ page = 1, limit = 10 }: PaginationDto) {
    const skip = (page - 1) * limit;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.image.findMany({
        skip,
        take: limit,
        orderBy: { uploadedAt: 'desc' },
      }),
      this.prisma.image.count(),
    ]);

    return {
      items: items.map((image) => ({
        id: image.id,
        url: image.url,
        filename: image.filename,
        uploadedAt: image.uploadedAt,
      })),
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async deleteImage(id: number): Promise<void> {
    const image = await this.prisma.image.findUnique({
      where: { id },
    });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    await this.cloudinary.deleteImage(image.publicId);

    await this.prisma.image.delete({
      where: { id },
    });
  }
}
