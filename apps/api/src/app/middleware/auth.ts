import { NextFunction, Request, Response } from "express";
import AppError from "../error/AppError.js";
import { verifyAccessToken } from "../utils/jwt.js";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

const auth = () => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError(401, "Authentication required");
    }

    const token = authHeader.split(" ")[1];

    try {
      const payload = verifyAccessToken(token);
      req.userId = payload.userId;
      next();
    } catch {
      throw new AppError(401, "Invalid or expired token");
    }
  };
};

export default auth;
