import { Injectable, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class UploadsService {
  async saveImage(file: Express.Multer.File, type: string) {
    if (!file) {
      throw new BadRequestException('No image provided');
    }

    const folders = ['posts', 'avatars'];

    if (!folders.includes(type)) {
      throw new BadRequestException('Invalid upload type');
    }

    const allowedTypes: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/gif': '.gif',
    };

    const extension = allowedTypes[file.mimetype];

    if (!extension) {
      throw new BadRequestException('Only images are allowed');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('Image must be smaller than 5MB');
    }

    const folder = join(process.cwd(), 'uploads', type);
    await mkdir(folder, { recursive: true });

    const filename = `${randomUUID()}${extension}`;
    const filePath = join(folder, filename);

    await writeFile(filePath, file.buffer);

    return {
      message: 'Image uploaded successfully',
      imageUrl: `/uploads/${type}/${filename}`,
    };
  }
}