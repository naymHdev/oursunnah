import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { NewsletterService } from "./newsletter.service.js";

const subscribe = catchAsync(async (req: Request, res: Response) => {
  const result = await NewsletterService.subscribe(req.body, req.userId);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Welcome to the Noor Circle",
    data: result,
  });
});

const unsubscribe = catchAsync(async (req: Request, res: Response) => {
  await NewsletterService.unsubscribe(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "You have been unsubscribed",
    data: null,
  });
});

export const NewsletterController = {
  subscribe,
  unsubscribe,
};
