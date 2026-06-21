import bcrypt from "bcryptjs";
import type { LoginInput, RegisterInput } from "@our-sunnah/validation";
import { ApiError } from "../../utils/ApiError.js";
import { signAccessToken, signRefreshToken } from "../../utils/jwt.js";
import { authRepository } from "./auth.repository.js";

const REFRESH_TOKEN_TTL_DAYS = 30;

const generateTokens = async (userId: string) => {
  const accessToken = signAccessToken({ userId });
  const refreshToken = signRefreshToken({ userId });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_TTL_DAYS);
  await authRepository.saveRefreshToken(userId, refreshToken, expiresAt);

  return { accessToken, refreshToken };
};

export const authService = {
  register: async (input: RegisterInput) => {
    const existingUser = await authRepository.findUserByEmail(input.email);
    if (existingUser) {
      throw ApiError.conflict("An account with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);
    const user = await authRepository.createUser({
      name: input.name,
      email: input.email,
      password: hashedPassword,
    });

    const tokens = await generateTokens(user.id);
    return { user: { id: user.id, name: user.name, email: user.email }, ...tokens };
  },

  login: async (input: LoginInput) => {
    const user = await authRepository.findUserByEmail(input.email);
    if (!user || !user.password) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const tokens = await generateTokens(user.id);
    return { user: { id: user.id, name: user.name, email: user.email }, ...tokens };
  },

  logout: async (refreshToken: string) => {
    await authRepository.deleteRefreshToken(refreshToken);
  },
};
