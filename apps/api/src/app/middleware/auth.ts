import { NextFunction, Request, Response } from "express";
import AppError from "../error/AppError.js";
import { verifyAccessToken } from "../utils/jwt.js";
import type { UserRole } from "@our-sunnah/database";

// Role hierarchy — higher index = more permissions
const ROLE_HIERARCHY: UserRole[] = [
  "CUSTOMER",
  "MANAGER",
  "EDITOR",
  "ADMIN",
  "SUPER_ADMIN",
];

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
    userRole?: UserRole;
  }
}

/**
 * Protect a route.
 *
 * @param allowedRoles - roles that may access this route.
 *   Pass nothing to allow any authenticated user.
 *   Pass "ADMIN" to allow ADMIN and SUPER_ADMIN (hierarchy-aware).
 *
 * @example
 *   router.post("/", auth("ADMIN", "EDITOR"), ...)
 *   router.get("/me", auth(), ...)
 */
const auth = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError(401, "Authentication required");
    }

    const token = authHeader.split(" ")[1];

    try {
      const payload = verifyAccessToken(token);
      req.userId = payload.userId;
      req.userRole = payload.role;
    } catch {
      throw new AppError(401, "Invalid or expired token");
    }

    // No role restriction — any authenticated user is allowed
    if (allowedRoles.length === 0) return next();

    const userRoleIndex = ROLE_HIERARCHY.indexOf(req.userRole!);

    // Allow if user's role index is >= the minimum allowed role index
    // e.g. auth("ADMIN") → ADMIN (idx 3) and SUPER_ADMIN (idx 4) both pass
    const minAllowedIndex = Math.min(
      ...allowedRoles.map((r) => ROLE_HIERARCHY.indexOf(r))
    );

    if (userRoleIndex < minAllowedIndex) {
      throw new AppError(403, "You do not have permission to perform this action");
    }

    next();
  };
};

export default auth;
