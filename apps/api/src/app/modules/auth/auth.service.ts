import bcrypt from "bcryptjs";
import type { LoginInput, RegisterInput, SocialLoginInput } from "@our-sunnah/validation";
import { AuthProvider } from "@our-sunnah/database";
import { prisma } from "../../../shared/prisma.js";
import AppError from "../../error/AppError.js";
import { signAccessToken, signRefreshToken } from "../../utils/jwt.js";

const REFRESH_TOKEN_TTL_DAYS = 30;

const generateTokens = async (userId: string) => {
  const accessToken = signAccessToken({ userId });
  const refreshToken = signRefreshToken({ userId });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_TTL_DAYS);
  await prisma.refreshToken.create({ data: { userId, token: refreshToken, expiresAt } });

  return { accessToken, refreshToken };
};

const createAccount = async (payload: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({ where: { email: payload.email } });
  if (existingUser) {
    throw new AppError(409, "An account with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);
  const user = await prisma.user.create({
    data: { name: payload.name, email: payload.email, password: hashedPassword },
  });

  const tokens = await generateTokens(user.id);
  return { user: { id: user.id, name: user.name, email: user.email }, ...tokens };
};

const loginAccount = async (payload: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: payload.email } });
  if (!user || !user.password) {
    throw new AppError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password");
  }

  const tokens = await generateTokens(user.id);
  return { user: { id: user.id, name: user.name, email: user.email }, ...tokens };
};

const logoutAccount = async (refreshToken: string) => {
  await prisma.refreshToken.delete({ where: { token: refreshToken } }).catch(() => null);
};

const socialLogin = async (payload: SocialLoginInput) => {
  const provider = payload.provider as AuthProvider;

  const existingSocialAccount = await prisma.socialAccount.findUnique({
    where: { provider_providerId: { provider, providerId: payload.providerId } },
    include: { user: true },
  });

  if (existingSocialAccount) {
    const tokens = await generateTokens(existingSocialAccount.user.id);
    return {
      user: {
        id: existingSocialAccount.user.id,
        name: existingSocialAccount.user.name,
        email: existingSocialAccount.user.email,
      },
      ...tokens,
    };
  }

  // No social link yet — check if a user already exists with this email
  // (e.g. they registered with credentials before), and link the account.
  let user = await prisma.user.findUnique({ where: { email: payload.email } });

  if (!user) {
    user = await prisma.user.create({
      data: { name: payload.name, email: payload.email, emailVerified: true },
    });
  }

  await prisma.socialAccount.create({
    data: { userId: user.id, provider, providerId: payload.providerId },
  });

  const tokens = await generateTokens(user.id);
  return { user: { id: user.id, name: user.name, email: user.email }, ...tokens };
};

export const AuthService = {
  createAccount,
  loginAccount,
  logoutAccount,
  socialLogin,
};
