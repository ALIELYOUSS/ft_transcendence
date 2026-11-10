import { Controller,Post,UseInterceptors, UploadedFile, Body, UseGuards, Req, Param, ParseUUIDPipe,} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtGuard } from '../auth/Guards/guards';
import { UploadsService } from './uploads.service';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
  };
}

@Controller('uploads')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('image')
  @ApiOperation({ summary: 'Upload a post or avatar image' })
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
    @Req() request: AuthenticatedRequest,
  ) {
    return this.uploadsService.saveImage(
      file,
      type,
      request.user.sub,
    );
  }

  @Post('chat/:chatId/attachment')
  @ApiOperation({ summary: 'Upload a chat image or document' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  uploadChatAttachment(
    @UploadedFile() file: Express.Multer.File,
    @Param('chatId', ParseUUIDPipe) chatId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.uploadsService.saveChatAttachment(
      file,
      chatId,
      request.user.sub,
    );
  }
}

