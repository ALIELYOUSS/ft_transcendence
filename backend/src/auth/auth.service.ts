import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import type { GoogleUser } from './google/google.strategy';
import { SAFE_USER_SELECT, interestsInput, rethrowPrismaError } from './safe-user';
import {
  hashRefreshToken,
  refreshTokenMatches,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from './tokens';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  // ======================= Sessions =======================

  async register({ username, email, password, interests }: CreateAuthDto) {
    if (await this.prisma.user.findUnique({ where: { email }, select: { id: true } })) {
      throw new ConflictException('Email is already registered');
    }
    if (await this.prisma.user.findUnique({ where: { username }, select: { id: true } })) {
      throw new ConflictException('Username is already taken');
    }

    // The checks above give clear messages; the catch still covers two sign-ups racing.
    return this.prisma.user
      .create({
        data: {
          username,
          email,
          password: await bcrypt.hash(password, 10),
          interests: interestsInput(interests),
        },
        select: SAFE_USER_SELECT,
      })
      .catch(rethrowPrismaError);
  }

  async login(email: string, password: string) {
    const found = await this.prisma.user.findUnique({
      where: { email },
      select: { ...SAFE_USER_SELECT, password: true },
    });

    // Same message for "no such user" and "wrong password", so emails can't be guessed.
    if (!found?.password || !(await bcrypt.compare(password, found.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { password: _, ...user } = found;
    return { user, ...(await this.issueTokens(user.id)) };
  }

  async loginWithGoogle({ googleId, email, emailVerified, username, avatarUrl }: GoogleUser) {
    // Already linked: trust the Google id.
    const linked = await this.prisma.user.findUnique({
      where: { googleId },
      select: { id: true, avatarUrl: true },
    });

    // Linking or creating by email is only safe when Google has verified the address.
    // Otherwise someone could use an unverified copy of your email to take over your account.
    if (!linked && (!email || !emailVerified)) {
      throw new ForbiddenException('Your Google email address is not verified');
    }

    const existing =
      linked ??
      (await this.prisma.user.findUnique({ where: { email }, select: { id: true, avatarUrl: true } }));

    const user = existing
      ? await this.prisma.user.update({
          where: { id: existing.id },
          // Keep an avatar the user already has.
          data: { googleId, avatarUrl: existing.avatarUrl ?? avatarUrl },
          select: SAFE_USER_SELECT,
        })
      : await this.prisma.user
          .create({
            data: {
              googleId,
              email: email!,
              avatarUrl,
              username: `${username || email!.split('@')[0]}-${googleId.slice(-6)}`,
            },
            select: SAFE_USER_SELECT,
          })
          .catch(rethrowPrismaError);

    return { user, ...(await this.issueTokens(user.id)) };
  }

  // Trades a valid refresh token for a new pair. The old refresh token stops working.
  async refresh(refreshToken: string) {
    const userId = verifyRefreshToken(refreshToken);
    const stored = userId
      ? await this.prisma.user.findUnique({ where: { id: userId }, select: { refreshedToken: true } })
      : null;

    if (!userId || !stored?.refreshedToken || !refreshTokenMatches(refreshToken, stored.refreshedToken)) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.issueTokens(userId);
  }

  // Revokes the stored refresh token. An invalid token is ignored, so logout always succeeds.
  async logout(refreshToken: string) {
    const userId = verifyRefreshToken(refreshToken);
    if (userId) {
      await this.prisma.user.updateMany({ where: { id: userId }, data: { refreshedToken: null } });
    }
  }

  private async issueTokens(userId: string) {
    const accessToken = signAccessToken(userId);
    const refreshToken = signRefreshToken(userId);

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshedToken: hashRefreshToken(refreshToken) },
    });

    return { accessToken, refreshToken };
  }

  // ======================= Users =======================

  findAll() {
    return this.prisma.user.findMany({ select: SAFE_USER_SELECT });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, select: SAFE_USER_SELECT });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  update(id: string, { username, bio, avatarUrl, interests }: UpdateAuthDto) {
    return this.prisma.user
      .update({
        where: { id },
        data: {
          username,
          bio,
          avatarUrl,
          ...(interests && { interests: { set: [], ...interestsInput(interests) } }),
        },
        select: SAFE_USER_SELECT,
      })
      .catch(rethrowPrismaError);
  }

  async changePassword(id: string, { currentPassword, newPassword }: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id }, select: { password: true } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Google-only accounts have no password yet and may set one directly.
    if (user.password && !(currentPassword && (await bcrypt.compare(currentPassword, user.password)))) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Clearing the refresh token logs out every session.
    await this.prisma.user.update({
      where: { id },
      data: { password: await bcrypt.hash(newPassword, 10), refreshedToken: null },
    });
  }

  async remove(id: string) {
    await this.prisma.user.delete({ where: { id }, select: { id: true } }).catch(rethrowPrismaError);
  }
}
