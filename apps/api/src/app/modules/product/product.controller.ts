import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { ProductService } from "./product.service.js";
import { ProductValidation } from "./product.validation.js";
import { AnalyticsService } from "../analytics/analytics.service.js";
import { UploadService } from "../upload/upload.service.js";
import { FileValidator } from "../upload/utils/file-validator.js";
import AppError from "../../error/AppError.js";

const createProduct = catchAsync(async (req: Request, res: Response) => {
  // Parse form data
  const formData = JSON.parse(req.body.data || "{}");
  const files = (req.files as Express.Multer.File[]) || [];

  // Validate files if provided
  if (files.length > 0) {
    const validation = FileValidator.validateBatch(files);
    if (!validation.isValid) {
      throw new AppError(400, validation.error!);
    }
  }

  // Upload images to Cloudinary if provided
  let uploadedImages: Array<{ url: string; publicId: string; position?: number }> = [];
  if (files.length > 0) {
    const uploadResult = await UploadService.uploadMultipleImages(
      files,
      "product"
    );
    uploadedImages = uploadResult.images.map((img, idx) => ({
      url: img.url,
      publicId: img.publicId,
      position: idx + 1,
    }));
  }

  // Merge uploaded images with provided images (if any)
  const allImages = [...uploadedImages, ...(formData.images || [])];

  // Create product with all data
  const payload = {
    ...formData,
    images: allImages,
  };

  const product = await ProductService.createProduct(payload);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Product created successfully with images",
    data: product,
  });
});

const getProducts = catchAsync(async (req: Request, res: Response) => {
  const query = ProductValidation.productQuerySchema.parse(req.query);
  const { items, meta } = await ProductService.getProducts(query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Products retrieved successfully",
    meta,
    data: items,
  });
});

const getProductBySlug = catchAsync(async (req: Request, res: Response) => {
  const product = await ProductService.getProductBySlug(req.params.slug);

  AnalyticsService.recordProductView({ userId: req.userId, productId: product.id }).catch(
    (err) => console.error("Failed to record product view:", err)
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Product retrieved successfully",
    data: product,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  // Check if this is multipart request (has files)
  const files = (req.files as Express.Multer.File[]) || [];
  
  if (files.length > 0) {
    // Multipart form data with images
    const formData = JSON.parse(req.body.data || "{}");

    // Validate files
    const validation = FileValidator.validateBatch(files);
    if (!validation.isValid) {
      throw new AppError(400, validation.error!);
    }

    // Upload new images
    const uploadResult = await UploadService.uploadMultipleImages(
      files,
      "product"
    );
    const uploadedImages = uploadResult.images.map((img, idx) => ({
      url: img.url,
      publicId: img.publicId,
      position: idx + 1,
    }));

    // Merge with any additional images from form
    const allImages = [...uploadedImages, ...(formData.images || [])];

    const payload = {
      ...formData,
      images: allImages,
    };

    const product = await ProductService.updateProduct(req.params.id, payload);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } else {
    // Standard JSON request
    const product = await ProductService.updateProduct(req.params.id, req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  }
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  await ProductService.deleteProduct(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Product deleted successfully",
    data: null,
  });
});

export const ProductController = {
  createProduct,
  getProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct,
};
