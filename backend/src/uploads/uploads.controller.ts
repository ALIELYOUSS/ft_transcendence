import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import {
  FileInterceptor,
} from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('image')
  @ApiOperation({ summary: 'Upload an image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        type: {
          type: 'string',
          enum: ['posts', 'avatars'],
        },
      },
      required: ['file', 'type'],
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: string,
  ) {
    return this.uploadsService.saveImage(file, type);
  }
}
