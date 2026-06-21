import { Prisma } from "@our-sunnah/database";
import type { TGenericErrorResponse } from "../interface/error.js";

const handlePrismaError = (
  err: Prisma.PrismaClientKnownRequestError | Prisma.PrismaClientValidationError
): TGenericErrorResponse => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return {
        statusCode: 409,
        message: "Duplicate value",
        errorSources: [
          { path: (err.meta?.target as string[])?.join(".") ?? "", message: "Already exists" },
        ],
      };
    }

    if (err.code === "P2025") {
      return {
        statusCode: 404,
        message: "Record not found",
        errorSources: [{ path: "", message: err.message }],
      };
    }

    return {
      statusCode: 400,
      message: "Database request error",
      errorSources: [{ path: "", message: err.message }],
    };
  }

  return {
    statusCode: 400,
    message: "Invalid database query",
    errorSources: [{ path: "", message: err.message }],
  };
};

export default handlePrismaError;
