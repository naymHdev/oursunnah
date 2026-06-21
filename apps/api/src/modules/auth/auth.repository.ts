import { prisma } from "@our-sunnah/database";

export const authRepository = {
  findUserByEmail: (email: string) => {
    return prisma.user.findUnique({ where: { email } });
  },

  createUser: (data: { name: string; email: string; password: string }) => {
    return prisma.user.create({ data });
  },

  saveRefreshToken: (userId: string, token: string, expiresAt: Date) => {
    return prisma.refreshToken.create({ data: { userId, token, expiresAt } });
  },

  findRefreshToken: (token: string) => {
    return prisma.refreshToken.findUnique({ where: { token } });
  },

  deleteRefreshToken: (token: string) => {
    return prisma.refreshToken.delete({ where: { token } }).catch(() => null);
  },
};
