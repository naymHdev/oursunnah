import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { AnalyticsService } from "./analytics.service.js";

const getMyInterests = catchAsync(async (req: Request, res: Response) => {
  const interests = await AnalyticsService.getTopInterests(req.userId as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Top interests retrieved successfully",
    data: interests,
  });
});

export const AnalyticsController = {
  getMyInterests,
};
