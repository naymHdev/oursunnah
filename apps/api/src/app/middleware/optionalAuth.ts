import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt.js";

const optionalAuth = () => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const payload = verifyAccessToken(token);
        req.userId = payload.userId;
      } catch {
        // Invalid/expired token on an optional route - proceed as a guest
        // rather than failing the request.
      }
    }

    next();
  };
};

export default optionalAuth;
