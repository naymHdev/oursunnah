import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { getRequestMeta } from "../../utils/getRequestMeta.js";
import { AuthService } from "./auth.service.js";

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/api/v1/auth",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

const createAccount = catchAsync(async (req: Request, res: Response) => {
  const meta = getRequestMeta(req);
  const { accessToken, refreshToken, user } = await AuthService.createAccount(req.body, meta);
  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Account created successfully",
    data: { user, accessToken },
  });
});

const loginAccount = catchAsync(async (req: Request, res: Response) => {
  const meta = getRequestMeta(req);
  const { accessToken, refreshToken, user } = await AuthService.loginAccount(req.body, meta);
  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Logged in successfully",
    data: { user, accessToken },
  });
});

const logoutAccount = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    await AuthService.logoutAccount(refreshToken);
  }
  res.clearCookie("refreshToken", { path: "/api/v1/auth" });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Logged out successfully",
    data: null,
  });
});

const socialLogin = catchAsync(async (req: Request, res: Response) => {
  const meta = getRequestMeta(req);
  const { accessToken, refreshToken, user } = await AuthService.socialLogin(req.body, meta);
  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Social login successful",
    data: { user, accessToken },
  });
});


const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;
  const { accessToken, user } = await AuthService.refreshAccessToken(token);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Token refreshed successfully",
    data: { accessToken, user },
  });
});

export const AuthController = {
  refreshToken,
  createAccount,
  loginAccount,
  logoutAccount,
  socialLogin,
};
