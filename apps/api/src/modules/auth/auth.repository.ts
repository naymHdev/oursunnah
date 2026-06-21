import { prisma, AuthProvider } from "@our-sunnah/database";

export const authRepository = {
  findUserByEmail: (email: string) => {
    return prisma.user.findUnique({ where: { email } });
  },

  createUser: (data: { name: string; email: string; password: string }) => {
    return prisma.user.create({ data });
  },

  findSocialAccount: (provider: AuthProvider, providerId: string) => {
    return prisma.socialAccount.findUnique({
      where: { provider_providerId: { provider, providerId } },
      include: { user: true },
    });
  },

  linkSocialAccount: (userId: string, provider: AuthProvider, providerId: string) => {
    return prisma.socialAccount.create({ data: { userId, provider, providerId } });
  },

  createUserFromSocial: (data: { name: string; email: string }) => {
    return prisma.user.create({ data: { ...data, emailVerified: true } });
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
