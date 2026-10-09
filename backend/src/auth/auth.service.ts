import {  ConflictException, 
          Injectable,
          UnauthorizedException,} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
const Jwt = require('jsonwebtoken');


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

    if (user) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: googleUser.googleId,
        },
      });
    } else {
      const username = `${googleUser.username || googleUser.email.split('@')[0]}-${googleUser.googleId.slice(-6)}`;

      user = await this.prisma.user.create({
        data: {
          username,
          email: googleUser.email,
          googleId: googleUser.googleId,
          password: await bcrypt.hash(randomBytes(32).toString('hex'), 10),
          intrests: {
            connectOrCreate: [],
          },
        },

      });
    }

    const tokens = await this.createTokens(user.id, user.email);
    const { password: _, refreshedToken: __, ...response } = user;

    return { response, ...tokens };
  }

async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ConflictException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ConflictException('Invalid email or password');
    }

    const { accessToken, refreshToken } = await this.createTokens(user.id, user.email);

    const { password: _, ...response } = user;
    return {response, accessToken, refreshToken};
  }

  private async createTokens(userId: string, email: string) {
    const jwtPayload = { sub: userId, email };
    const accessToken = Jwt.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = Jwt.sign(jwtPayload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

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
    payload = Jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET) as { email: string; sub: string };
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

  const tokens = await this.createTokens(user.id, user.email);
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

    const hashPass = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashPass,
        interests: {
          connectOrCreate: interests.map((interestName) => ({
            where: {
              name: interestName,
            },
            create: {
              name: interestName,
            },
          })),
        },
      },
      include: {
        interests: true,
      },
  });

    console.log("New user created:", newUser);

    const { password: _, ...response } = newUser;
    return response;
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
    payload = Jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    ) as { sub: string };
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
    const { interests: _interests, ...data } = updateAuthDto;
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
