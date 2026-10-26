import { Injectable, Logger } from '@nestjs/common';

interface NominatimResponse {
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state?: string;
    country?: string;
  };
}

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);

  async getCityFromCoordinates(
    latitude: number,
    longitude: number,
  ): Promise<string> {
    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return 'Unknown';
    }

    const url = new URL(
      'https://nominatim.openstreetmap.org/reverse',
    );

    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('lat', String(latitude));
    url.searchParams.set('lon', String(longitude));
    url.searchParams.set('zoom', '10');
    url.searchParams.set('addressdetails', '1');

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'WeMeet-chatbot',
          'Accept-Language': 'en',
        },
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        this.logger.warn(
          `Nominatim returned HTTP ${response.status}`,
        );
        return 'Unknown';
      }

      const data = (await response.json()) as NominatimResponse;

      const address = data.address;

      return (
        address?.city ||
        address?.town ||
        address?.village ||
        address?.municipality ||
        address?.county ||
        address?.state ||
        address?.country ||
        'Unknown'
      );
    } catch (error) {
      this.logger.warn(
        `Location lookup failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      );

      return 'Unknown';
    }
  }
}
