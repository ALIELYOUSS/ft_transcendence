import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {

  constructor(private readonly prisma: PrismaService) {}
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
