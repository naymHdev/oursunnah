import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";

/**
 * Restricts a route to requests carrying the shared internal secret.
 * Used for server-to-server calls (e.g. Next.js verifying a social
 * login on behalf of an already-authenticated OAuth flow), where the
 * caller is trusted infra, not an end user.
 */
export const requireInternalSecret = (req: Request, _res: Response, next: NextFunction) => {
  const secret = req.headers["x-internal-secret"];

  if (!secret || secret !== env.INTERNAL_API_SECRET) {
    return next(ApiError.forbidden("Forbidden"));
  }

  next();
};
