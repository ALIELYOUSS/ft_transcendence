import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

// The only user fields ever sent to a client. Never add password, refreshedToken or googleId.
export const SAFE_USER_SELECT = {
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

// Prisma input that replaces a user's interests, creating any that don't exist yet.
export function interestsInput(names: string[]) {
  return {
    connectOrCreate: names.map(name => ({ where: { name }, create: { name } })),
  };
}

// Turns Prisma "unique constraint" / "record not found" errors into 409 / 404 instead of 500.
// Use as: prisma.user.update(...).catch(rethrowPrismaError)
export function rethrowPrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      const target = error.meta?.target;
      const field = Array.isArray(target) ? target.join(', ') : 'value';
      throw new ConflictException(`That ${field} is already taken`);
    }
    if (error.code === 'P2025') {
      throw new NotFoundException('User not found');
    }
  }
  throw error;
}
