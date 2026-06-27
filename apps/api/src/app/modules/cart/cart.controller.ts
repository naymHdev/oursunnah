import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { CartService } from "./cart.service.js";
import { CartValidation } from "./cart.validation.js";

const getCart = catchAsync(async (req: Request, res: Response) => {
  const cart = await CartService.getCart(req.userId as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Cart retrieved successfully",
    data: cart,
  });
});

const addItem = catchAsync(async (req: Request, res: Response) => {
  const input = CartValidation.addCartItemSchema.parse(req.body);
  const cart = await CartService.addItem(req.userId as string, input);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Item added to cart",
    data: cart,
  });
});

const updateItem = catchAsync(async (req: Request, res: Response) => {
  const { quantity } = CartValidation.updateCartItemSchema.parse(req.body);
  const cart = await CartService.updateItemQuantity(req.userId as string, req.params.itemId, quantity);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Cart updated",
    data: cart,
  });
});

const removeItem = catchAsync(async (req: Request, res: Response) => {
  const cart = await CartService.removeItem(req.userId as string, req.params.itemId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Item removed from cart",
    data: cart,
  });
});

const clearCart = catchAsync(async (req: Request, res: Response) => {
  const cart = await CartService.clearCart(req.userId as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Cart cleared",
    data: cart,
  });
});

const mergeCart = catchAsync(async (req: Request, res: Response) => {
  const input = CartValidation.mergeCartSchema.parse(req.body);
  const cart = await CartService.mergeCart(req.userId as string, input);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Cart merged successfully",
    data: cart,
  });
});

export const CartController = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  mergeCart,
};
