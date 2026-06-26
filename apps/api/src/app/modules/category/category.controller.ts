import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { CategoryService } from "./category.service.js";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await CategoryService.createCategory(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

const getCategoryTree = catchAsync(async (_req: Request, res: Response) => {
  const tree = await CategoryService.getCategoryTree();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category tree retrieved successfully",
    data: tree,
  });
});

const getCategoryBySlug = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.getCategoryBySlug(req.params.slug as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category retrieved successfully",
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await CategoryService.updateCategory(req.params.id as string, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category updated successfully",
    data: category,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  await CategoryService.deleteCategory(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category deleted successfully",
    data: null,
  });
});

const reorderCategories = catchAsync(async (req: Request, res: Response) => {
  await CategoryService.reorderCategories(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Categories reordered successfully",
    data: null,
  });
});

export const CategoryController = {
  createCategory,
  getCategoryTree,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
  reorderCategories,
};
