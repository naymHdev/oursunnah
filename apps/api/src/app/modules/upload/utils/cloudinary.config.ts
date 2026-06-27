import { v2 as cloudinary } from "cloudinary";
import { env } from "../../config/env.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

/**
 * Stream-based upload to Cloudinary
 * Optimized for performance with buffer streaming
 */
export const uploadToCloudinary = (
  buffer: Buffer,
  filename: string,
  folder: string,
  productId?: string
): Promise<{
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: productId ? `${folder}/${productId}` : folder, // Nested folder for products
        resource_type: "auto",
        format: "auto", // auto webp for modern browsers
        quality: "auto:good", // auto-optimize quality
        flags: ["progressive"], // Progressive JPEG for faster loading
        cache_control: "max-age=31536000,public,immutable", // 1 year cache
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            public_id: result!.public_id,
            secure_url: result!.secure_url,
            width: result!.width,
            height: result!.height,
            format: result!.format,
            bytes: result!.bytes,
          });
        }
      }
    );

    // Stream buffer to Cloudinary
    uploadStream.end(buffer);
  });
};

/**
 * Delete image from Cloudinary
 */
export const deleteFromCloudinary = (
  publicId: string
): Promise<{ result: string }> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

/**
 * Bulk delete multiple images
 */
export const bulkDeleteFromCloudinary = async (
  publicIds: string[]
): Promise<void> => {
  if (!publicIds || publicIds.length === 0) return;

  const deletePromises = publicIds.map((id) =>
    deleteFromCloudinary(id).catch((err) => {
      console.error(`Failed to delete ${id}:`, err);
      // Don't throw, continue with other deletions
    })
  );

  await Promise.all(deletePromises);
};

/**
 * Generate Cloudinary URL with transformations
 */
export const getOptimizedUrl = (
  publicId: string,
  width?: number,
  height?: number
): string => {
  if (!publicId) return "";

  const transformations: string[] = [];

  if (width || height) {
    const w = width ? `w_${width}` : "";
    const h = height ? `h_${height}` : "";
    transformations.push(`${w}${h ? "," + h : ""}`);
  }

  transformations.push("q_auto:good", "f_auto"); // Quality & format auto

  const url = cloudinary.url(publicId, {
    secure: true,
    transformation: transformations,
  });

  return url;
};

export { cloudinary };
