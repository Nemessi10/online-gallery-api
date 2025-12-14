import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  HttpCode,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ImagesService } from './images.service';
import { PaginationDto } from './dto/pagination.dto';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return this.imagesService.uploadImage(file);
  }

  @Get()
  async findAll(@Query() pagination: PaginationDto) {
    return this.imagesService.getAllImages(pagination);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.imagesService.deleteImage(id);
  }
}
