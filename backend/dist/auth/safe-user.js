"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SAFE_USER_SELECT = void 0;
exports.interestsInput = interestsInput;
exports.rethrowPrismaError = rethrowPrismaError;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
exports.SAFE_USER_SELECT = {
    id: true,
    username: true,
    email: true,
    bio: true,
    avatarUrl: true,
    role: true,
    createdAt: true,
    updatedAt: true,
    interests: { select: { name: true } },
};
function interestsInput(names) {
    return {
        connectOrCreate: names.map(name => ({ where: { name }, create: { name } })),
    };
}
function rethrowPrismaError(error) {
    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            const target = error.meta?.target;
            const field = Array.isArray(target) ? target.join(', ') : 'value';
            throw new common_1.ConflictException(`That ${field} is already taken`);
        }
        if (error.code === 'P2025') {
            throw new common_1.NotFoundException('User not found');
        }
    }
    throw error;
}
//# sourceMappingURL=safe-user.js.map