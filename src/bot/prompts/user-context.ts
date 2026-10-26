import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { LocationService } from '../location/location.service.js';

@Injectable()
export class UserContextService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly locationService: LocationService,
  ) {}

  async getUserContext(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
        bio: true,
        latitude: true,
        longitude: true,
        interests: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const interests = user.interests.map(
      (interest) => interest.name,
    );

    let location = 'Unknown';

    if (user.latitude !== null && user.longitude !== null) {
      location = await this.locationService.getCityFromCoordinates(
        user.latitude,
        user.longitude,
      );
    }

    return `
      User profile:
      - Username: ${user.username}
      - Bio: ${user.bio ?? 'Not provided'}
      - Interests: ${interests.length > 0 ? interests.join(', ') : 'Not provided'}
      - Location: ${location}
          `.trim();
  }
}
