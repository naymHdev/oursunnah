import { NextFunction, Request, Response } from "express";

const notFound = (req: Request, res: Response, _next: NextFunction) => {
  return res.status(404).json({
    success: false,
    message: `API Not Found: ${req.originalUrl}`,
  });
};

export default notFound;
