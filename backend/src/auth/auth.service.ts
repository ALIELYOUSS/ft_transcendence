import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
const Jwt = require('jsonwebtoken');

// The only user fields ever sent to a client. Never add password, refreshedToken or googleId.
const SAFE_USER_SELECT = {
  id: true,
  username: true,
  email: true,
  bio: true,
  avatarUrl: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  interests: { select: { name: true } },
} satisfies Prisma.UserSelect;

// Turns Prisma "unique constraint" / "record not found" errors into 409 / 404 instead of 500.
function rethrowPrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      const target = error.meta?.target;
      const field = Array.isArray(target) ? target.join(', ') : String(target ?? 'value');
      throw new ConflictException(`That ${field} is already taken`);
    }
    if (error.code === 'P2025') {
      throw new NotFoundException('User not found');
    }
  }
  throw error;
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async loginWithGoogle(googleUser: {
    googleId: string;
    email?: string;
    username?: string;
    interests?: string[];
  }) {
    if (!googleUser.email) {
      throw new ConflictException('Google account does not have an email');
    }

    let user = await this.prisma.user.findUnique({
      where: { googleId: googleUser.googleId },
    });

    if (!user) {
      user = await this.prisma.user.findUnique({
        where: { email: googleUser.email },
      });
    }

    let response;
    if (user) {
      response = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: googleUser.googleId,
        },
        select: SAFE_USER_SELECT,
      });
    } else {
      const username = `${googleUser.username || googleUser.email.split('@')[0]}-${googleUser.googleId.slice(-6)}`;

      response = await this.prisma.user.create({
        data: {
          username,
          email: googleUser.email,
          googleId: googleUser.googleId,
          password: null,
          interests: {
            connectOrCreate: [],
          },
        },
        select: SAFE_USER_SELECT,
      });
    }

    const tokens = await this.createTokens(response.id);

    return { response, ...tokens };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { ...SAFE_USER_SELECT, password: true },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const { accessToken, refreshToken } = await this.createTokens(user.id);

    const { password: _, ...response } = user;
    return { response, accessToken, refreshToken };
  }

  private async createTokens(userId: string) {
    const jwtPayload = { sub: userId };
    const accessToken = Jwt.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = Jwt.sign(jwtPayload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '7d',
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshedToken: await bcrypt.hash(refreshToken, 10) },
    });

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    let payload: {
      email: string;
      sub: string;
    };
    try {
      payload = Jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as {
        email: string;
        sub: string;
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.refreshedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshedToken);
    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.createTokens(user.id);
    return tokens;
  }

  async reg(createAuthDto: CreateAuthDto) {
    const { email, password, username, interests } = createAuthDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const existingUsername = await this.prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (existingUsername) {
      throw new ConflictException('Username is already taken');
    }

    const hashPass = await bcrypt.hash(password, 10);

    // The checks above give clear messages; the catch still covers two sign-ups racing.
    return this.prisma.user
      .create({
        data: {
          username,
          email,
          password: hashPass,
          interests: {
            connectOrCreate: interests.map(interestName => ({
              where: {
                name: interestName,
              },
              create: {
                name: interestName,
              },
            })),
          },
        },
        select: SAFE_USER_SELECT,
      })
      .catch(rethrowPrismaError);
  }

  create(createAuthDto: CreateAuthDto) {
    return this.reg(createAuthDto);
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
      },
    });
  }

  async logout(refreshToken: string) {
    let payload: { sub: string };

    try {
      payload = Jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as { sub: string };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.prisma.user.updateMany({
      where: {
        id: payload.sub,
        refreshedToken: {
          not: null,
        },
      },
      data: {
        refreshedToken: null,
      },
    });

    return { message: 'Logged out successfully' };
  }

  update(id: string, updateAuthDto: UpdateAuthDto) {
    const { username, bio, avatarUrl, interests } = updateAuthDto;
    return this.prisma.user
      .update({
        where: { id },
        data: {
          username,
          bio,
          avatarUrl,
          ...(interests && {
            interests: {
              set: [],
              connectOrCreate: interests.map(name => ({
                where: { name },
                create: { name },
              })),
            },
          }),
        },
        select: SAFE_USER_SELECT,
      })
      .catch(rethrowPrismaError);
  }

  async changePassword(id: string, { currentPassword, newPassword }: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { password: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Google-only accounts have no password yet and may set one directly.
    if (user.password) {
      const isValid =
        currentPassword !== undefined && (await bcrypt.compare(currentPassword, user.password));
      if (!isValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }
    }

    // Clearing the refresh token logs out other sessions after a password change.
    await this.prisma.user.update({
      where: { id },
      data: { password: await bcrypt.hash(newPassword, 10), refreshedToken: null },
    });
  }

  async remove(id: string) {
    await this.prisma.user.delete({ where: { id }, select: { id: true } }).catch(rethrowPrismaError);
  }
}
