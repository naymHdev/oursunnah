import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { Prisma } from "@our-sunnah/database";
import type { TErrorSources } from "../interface/error.js";
import handleZodError from "../error/ZodError.js";
import handlePrismaError from "../error/handlePrismaError.js";
import AppError from "../error/AppError.js";
import { env } from "../config/env.js";

const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorSources: TErrorSources = [{ path: "", message: "Something went wrong" }];

  if (
    err instanceof Prisma.PrismaClientKnownRequestError ||
    err instanceof Prisma.PrismaClientValidationError
  ) {
    const simplified = handlePrismaError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorSources = simplified.errorSources;
  } else if (err instanceof ZodError) {
    const simplified = handleZodError(err);
    statusCode = simplified.statusCode;
    message = simplified.message;
    errorSources = simplified.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [{ path: "", message: err.message }];
  } else if (err instanceof Error) {
    message = err.message;
    errorSources = [{ path: "", message: err.message }];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: env.NODE_ENV === "development" ? err?.stack : null,
  });
};

export default globalErrorHandler;
