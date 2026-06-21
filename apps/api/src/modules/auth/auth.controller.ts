import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { authService } from "./auth.service.js";

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/api/auth",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

export const authController = {
  register: catchAsync(async (req: Request, res: Response) => {
    const { accessToken, refreshToken, user } = await authService.register(req.body);
    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
    ApiResponse.success(res, 201, "Account created successfully", { user, accessToken });
  }),

  login: catchAsync(async (req: Request, res: Response) => {
    const { accessToken, refreshToken, user } = await authService.login(req.body);
    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
    ApiResponse.success(res, 200, "Logged in successfully", { user, accessToken });
  }),

  logout: catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await authService.logout(refreshToken);
    }
    res.clearCookie("refreshToken", { path: "/api/auth" });
    ApiResponse.success(res, 200, "Logged out successfully");
  }),

  socialLogin: catchAsync(async (req: Request, res: Response) => {
    const { accessToken, refreshToken, user } = await authService.socialLogin(req.body);
    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
    ApiResponse.success(res, 200, "Social login successful", { user, accessToken });
  }),
};
