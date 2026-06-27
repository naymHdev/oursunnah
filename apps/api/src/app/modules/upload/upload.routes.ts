import { Router } from "express";
import auth from "../../middleware/auth.js";
import { UploadController } from "./upload.controller.js";
import {
  uploadSingle,
  uploadMultiple,
  handleMulterErrors,
} from "./upload.middleware.js";

const router = Router();

/**
 * POST /api/v1/upload/image?type=product&productId=xyz
 * Upload single image
 * Query params:
 *   - type: 'product' | 'category' (default: 'product')
 *   - productId: (optional) nested folder structure for product images
 * Body: form-data with field name 'image'
 */
router.post(
  "/image",
  auth(),
  uploadSingle,
  handleMulterErrors,
  UploadController.uploadSingleImage
);

/**
 * POST /api/v1/upload/images?type=product&productId=xyz
 * Upload multiple images (batch)
 * Query params:
 *   - type: 'product' | 'category' (default: 'product')
 *   - productId: (optional) nested folder structure for product images
 * Body: form-data with field name 'images' (up to 10 files)
 */
router.post(
  "/images",
  auth(),
  uploadMultiple,
  handleMulterErrors,
  UploadController.uploadMultipleImages
);

/**
 * DELETE /api/v1/upload/:publicId
 * Delete single image from Cloudinary
 * Params:
 *   - publicId: Cloudinary public ID (e.g., 'our-sunnah/products/abc123')
 */
router.delete(
  "/:publicId",
  auth(),
  UploadController.deleteImage
);

/**
 * DELETE /api/v1/upload/bulk
 * Bulk delete multiple images (used when deleting a product with multiple images)
 * Body:
 *   {
 *     "publicIds": ["our-sunnah/products/img1", "our-sunnah/products/img2"]
 *   }
 */
router.delete(
  "/bulk",
  auth(),
  UploadController.bulkDeleteImages
);

export const UploadRoutes = router;
