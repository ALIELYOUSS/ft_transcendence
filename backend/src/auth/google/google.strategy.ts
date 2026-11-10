import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { cookieStateStore } from './google-state.store';

// What the strategy puts in req.user after Google sign-in.
export type GoogleUser = {
  googleId: string;
  email?: string;
  emailVerified: boolean;
  username?: string;
  avatarUrl?: string;
};

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: ConfigService) {
    super({
      clientID: config.getOrThrow<string>('google.clientId'),
      clientSecret: config.getOrThrow<string>('google.clientSecret'),
      callbackURL: config.getOrThrow<string>('google.callbackURL'),
      scope: ['email', 'profile'],
      store: cookieStateStore,
    });
  }

  // Google's own tokens aren't needed, only the profile.
  validate(_accessToken: string, _refreshToken: string, profile: Profile): GoogleUser {
    return {
      googleId: profile.id,
      email: profile.emails?.[0]?.value,
      emailVerified: profile._json.email_verified === true,
      username: profile.displayName,
      avatarUrl: profile.photos?.[0]?.value,
    };
  }
}
