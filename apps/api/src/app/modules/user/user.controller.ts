import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { UserService } from "./user.service.js";

const getProfile = catchAsync(async (req: Request, res: Response) => {
  const user = await UserService.getProfile(req.userId as string);
  sendResponse(res, { statusCode: 200, success: true, message: "Profile retrieved", data: user });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const user = await UserService.updateProfile(req.userId as string, req.body);
  sendResponse(res, { statusCode: 200, success: true, message: "Profile updated", data: user });
});

const listAddresses = catchAsync(async (req: Request, res: Response) => {
  const addresses = await UserService.listAddresses(req.userId as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Addresses retrieved",
    data: addresses,
  });
});

const createAddress = catchAsync(async (req: Request, res: Response) => {
  const address = await UserService.createAddress(req.userId as string, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Address created",
    data: address,
  });
});

const updateAddress = catchAsync(async (req: Request, res: Response) => {
  const address = await UserService.updateAddress(req.userId as string, req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Address updated",
    data: address,
  });
});

const deleteAddress = catchAsync(async (req: Request, res: Response) => {
  await UserService.deleteAddress(req.userId as string, req.params.id);
  sendResponse(res, { statusCode: 200, success: true, message: "Address deleted", data: null });
});

export const UserController = {
  getProfile,
  updateProfile,
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
};
