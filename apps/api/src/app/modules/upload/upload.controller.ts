import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { UploadService } from "./upload.service.js";
import { UploadFormatter } from "./utils/upload-formatter.js";

const uploadSingleImage = catchAsync(
  async (req: Request & { query: { type?: string; productId?: string } }, res: Response) => {
    const { type = "product", productId } = req.query;

    const validTypes = ["product", "category"];
    if (!validTypes.includes(type)) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "অবৈধ আপলোড টাইপ। শুধুমাত্র 'product' বা 'category' অনুমতিপ্রাপ্ত।",
        data: null,
      });
    }

    const image = await UploadService.uploadSingleImage(
      req.file!,
      type as "product" | "category",
      productId
    );

    const formattedData = UploadFormatter.getProductImageFormat(image);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "ছবি সফলভাবে আপলোড হয়েছে।",
      data: {
        ...formattedData,
        optimizedUrls: image.optimizedUrls,
        width: image.width,
        height: image.height,
        format: image.format,
      },
    });
  }
);

const uploadMultipleImages = catchAsync(
  async (req: Request & { query: { type?: string; productId?: string } }, res: Response) => {
    const { type = "product", productId } = req.query;

    const validTypes = ["product", "category"];
    if (!validTypes.includes(type)) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "অবৈধ আপলোড টাইপ। শুধুমাত্র 'product' বা 'category' অনুমতিপ্রাপ্ত।",
        data: null,
      });
    }

    const result = await UploadService.uploadMultipleImages(
      req.files as Express.Multer.File[],
      type as "product" | "category",
      productId
    );

    const formattedImages = UploadFormatter.getProductImagesFormat(result.images);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: `${result.count}টি ছবি সফলভাবে আপলোড হয়েছে।`,
      data: {
        images: formattedImages.map((img, idx) => ({
          ...img,
          optimizedUrls: result.images[idx].optimizedUrls,
          width: result.images[idx].width,
          height: result.images[idx].height,
          format: result.images[idx].format,
        })),
        count: result.count,
        totalSize: result.totalSize,
      },
    });
  }
);

const deleteImage = catchAsync(async (req: Request, res: Response) => {
  const { publicId } = req.params;

  const result = await UploadService.deleteSingleImage(publicId);

  sendResponse(res, {
    statusCode: 200,
    success: result.success,
    message: result.message,
    data: null,
  });
});

const bulkDeleteImages = catchAsync(async (req: Request, res: Response) => {
  const { publicIds } = req.body;

  if (!Array.isArray(publicIds)) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "publicIds একটি অ্যারে হতে হবে।",
      data: null,
    });
  }

  const result = await UploadService.bulkDeleteImages(publicIds);

  sendResponse(res, {
    statusCode: 200,
    success: result.success,
    message: result.message,
    data: {
      deletedCount: result.deletedCount,
    },
  });
});

export const UploadController = {
  uploadSingleImage,
  uploadMultipleImages,
  deleteImage,
  bulkDeleteImages,
};
