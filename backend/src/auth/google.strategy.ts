import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('google.clientId'),
      clientSecret: configService.getOrThrow<string>('google.clientSecret'),
      callbackURL: configService.getOrThrow<string>('google.callbackURL'),
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ) {
    return {
      googleId: profile.id,
      email: profile.emails?.[0]?.value,
      username: profile.displayName,
      avatarUrl: profile.photos?.[0]?.value,
      accessToken,
      refreshToken,
    };
  }
}
