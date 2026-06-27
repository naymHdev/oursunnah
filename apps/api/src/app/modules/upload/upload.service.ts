import AppError from "../../error/AppError.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  bulkDeleteFromCloudinary,
} from "./utils/cloudinary.config.js";
import { CLOUDINARY_FOLDERS } from "./utils/constants.js";
import { ErrorMessages, SuccessMessages } from "./utils/error-messages.js";
import { FileValidator } from "./utils/file-validator.js";
import { UploadFormatter } from "./utils/upload-formatter.js";

export class UploadService {
  /**
   * Upload single image
   */
  static async uploadSingleImage(
    file: Express.Multer.File,
    type: "product" | "category",
    productId?: string
  ) {
    if (!file) {
      throw new AppError(400, "কোনো ফাইল পাওয়া যায়নি।");
    }

    // Validate file
    const validation = FileValidator.validateFile(file);
    if (!validation.isValid) {
      throw new AppError(400, validation.error!);
    }

    try {
      const folder = 
        type === "product"
          ? CLOUDINARY_FOLDERS.PRODUCTS
          : CLOUDINARY_FOLDERS.CATEGORIES;

      const result = await uploadToCloudinary(
        file.buffer,
        file.originalname,
        folder,
        productId // Will create /our-sunnah/products/{productId} structure
      );

      const image = UploadFormatter.formatSingleImage(
        result.public_id,
        result.secure_url,
        result.width,
        result.height,
        result.format,
        result.bytes
      );

      return image;
    } catch (error: any) {
      console.error("Cloudinary upload error:", error);
      throw new AppError(
        500,
        error?.message || ErrorMessages.CLOUDINARY_UPLOAD_FAILED
      );
    }
  }

  /**
   * Upload multiple images (batch)
   */
  static async uploadMultipleImages(
    files: Express.Multer.File[],
    type: "product" | "category",
    productId?: string
  ) {
    if (!files || files.length === 0) {
      throw new AppError(400, "কোনো ফাইল পাওয়া যায়নি।");
    }

    // Validate batch
    const validation = FileValidator.validateBatch(files);
    if (!validation.isValid) {
      throw new AppError(400, validation.error!);
    }

    // Log warnings if any
    if (validation.warnings?.length) {
      validation.warnings.forEach((w) => console.warn(w));
    }

    try {
      const folder =
        type === "product"
          ? CLOUDINARY_FOLDERS.PRODUCTS
          : CLOUDINARY_FOLDERS.CATEGORIES;

      // Upload all files in parallel for speed
      const uploadPromises = files.map((file) =>
        uploadToCloudinary(
          file.buffer,
          file.originalname,
          folder,
          productId
        )
      );

      const results = await Promise.all(uploadPromises);

      const images = UploadFormatter.formatBatchImages(results);

      // Calculate total size
      const totalSize = results.reduce((sum, img) => sum + img.bytes, 0);

      return {
        images,
        count: images.length,
        totalSize,
      };
    } catch (error: any) {
      console.error("Cloudinary batch upload error:", error);
      throw new AppError(
        500,
        error?.message || ErrorMessages.CLOUDINARY_UPLOAD_FAILED
      );
    }
  }

  /**
   * Delete single image
   */
  static async deleteSingleImage(publicId: string) {
    if (!publicId || typeof publicId !== "string") {
      throw new AppError(400, ErrorMessages.INVALID_PUBLIC_ID);
    }

    // Validate publicId format (basic check)
    if (!/^[\w\-/\.]+$/.test(publicId)) {
      throw new AppError(400, ErrorMessages.INVALID_PUBLIC_ID);
    }

    try {
      await deleteFromCloudinary(publicId);
      return {
        success: true,
        publicId,
        message: SuccessMessages.DELETE_SUCCESS,
      };
    } catch (error: any) {
      console.error("Cloudinary delete error:", error);
      throw new AppError(
        500,
        error?.message || ErrorMessages.CLOUDINARY_DELETE_FAILED
      );
    }
  }

  /**
   * Bulk delete images
   * Called when deleting a product with multiple images
   */
  static async bulkDeleteImages(publicIds: string[]) {
    if (!publicIds || publicIds.length === 0) {
      return {
        success: true,
        deletedCount: 0,
        message: "কোনো ছবি মুছে ফেলার দরকার ছিল না।",
      };
    }

    // Validate all publicIds
    const invalidIds = publicIds.filter(
      (id) => !id || typeof id !== "string" || !/^[\w\-/\.]+$/.test(id)
    );

    if (invalidIds.length > 0) {
      throw new AppError(400, `অবৈধ পাবলিক আইডি: ${invalidIds.join(", ")}`);
    }

    try {
      await bulkDeleteFromCloudinary(publicIds);

      return {
        success: true,
        deletedCount: publicIds.length,
        message: SuccessMessages.BULK_DELETE_SUCCESS,
      };
    } catch (error: any) {
      console.error("Cloudinary bulk delete error:", error);
      // Don't throw - log and continue
      return {
        success: false,
        deletedCount: 0,
        message: ErrorMessages.CLOUDINARY_DELETE_FAILED,
        error: error?.message,
      };
    }
  }
}
