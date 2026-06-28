import bcrypt from "bcryptjs";
import type { LoginInput, RegisterInput, SocialLoginInput } from "@our-sunnah/validation";
import { AuthProvider } from "@our-sunnah/database";
import { prisma } from "../../../shared/prisma.js";
import AppError from "../../error/AppError.js";
import { signAccessToken, signRefreshToken } from "../../utils/jwt.js";
import type { RequestMeta } from "../../utils/getRequestMeta.js";

const REFRESH_TOKEN_TTL_DAYS = 30;

const generateTokens = async (userId: string, role: import("@our-sunnah/database").UserRole, meta?: RequestMeta) => {
  const accessToken = signAccessToken({ userId, role });
  const refreshToken = signRefreshToken({ userId, role });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_TTL_DAYS);

  await prisma.refreshToken.create({
    data: {
      userId,
      token: refreshToken,
      expiresAt,
      ipAddress: meta?.ipAddress,
      country: meta?.country,
      city: meta?.city,
      deviceType: meta?.deviceType,
      browser: meta?.browser,
      os: meta?.os,
    },
  });

  return { accessToken, refreshToken };
};


const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken) throw new AppError(401, "No refresh token provided");

  // Verify the token is valid JWT
  const { verifyRefreshToken } = await import("../../utils/jwt.js");
  let payload: import("../../utils/jwt.js").JwtPayload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError(401, "Invalid or expired refresh token");
  }

  // Make sure it exists in DB and is not revoked
  const stored = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
    throw new AppError(401, "Refresh token has been revoked or expired");
  }

  // Issue new access token — refresh token stays the same (rotation not needed for dashboard)
  const accessToken = signAccessToken({ userId: payload.userId, role: payload.role });

  // Update lastActiveAt
  await prisma.refreshToken.update({
    where: { token: refreshToken },
    data: { lastActiveAt: new Date() },
  });

  return { accessToken, user: { id: stored.user.id, name: stored.user.name, email: stored.user.email } };
};

const createAccount = async (payload: RegisterInput, meta?: RequestMeta) => {
  const existingUser = await prisma.user.findUnique({ where: { email: payload.email } });
  if (existingUser) {
    throw new AppError(409, "An account with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);
  const user = await prisma.user.create({
    data: { name: payload.name, email: payload.email, password: hashedPassword },
  });

  const tokens = await generateTokens(user.id, user.role, meta);
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, ...tokens };
};

const loginAccount = async (payload: LoginInput, meta?: RequestMeta) => {
  const user = await prisma.user.findUnique({ where: { email: payload.email } });
  if (!user || !user.password) {
    throw new AppError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password");
  }

  const tokens = await generateTokens(user.id, user.role, meta);
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, ...tokens };
};

const logoutAccount = async (refreshToken: string) => {
  // Marked revoked rather than deleted, so login history is preserved
  // for the session list / "where you're logged in" type features.
  await prisma.refreshToken
    .update({ where: { token: refreshToken }, data: { revokedAt: new Date() } })
    .catch(() => null);
};

const socialLogin = async (payload: SocialLoginInput, meta?: RequestMeta) => {
  const provider = payload.provider as AuthProvider;

  const existingSocialAccount = await prisma.socialAccount.findUnique({
    where: { provider_providerId: { provider, providerId: payload.providerId } },
    include: { user: true },
  });

  if (existingSocialAccount) {
    const tokens = await generateTokens(existingSocialAccount.user.id, existingSocialAccount.user.role, meta);
    return {
      user: {
        id: existingSocialAccount.user.id,
        name: existingSocialAccount.user.name,
        email: existingSocialAccount.user.email,
        role: existingSocialAccount.user.role,
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

  const tokens = await generateTokens(user.id, user.role, meta);
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, ...tokens };
};

export const AuthService = {
  refreshAccessToken,
  createAccount,
  loginAccount,
  logoutAccount,
  socialLogin,
};
