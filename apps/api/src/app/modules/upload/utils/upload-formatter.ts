import { getOptimizedUrl } from "./cloudinary.config.js";

export interface UploadedImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  optimizedUrls?: {
    thumbnail: string;
    medium: string;
    large: string;
  };
}

export class UploadFormatter {
  /**
   * Format single uploaded image
   */
  static formatSingleImage(
    publicId: string,
    secureUrl: string,
    width: number,
    height: number,
    format: string,
    bytes: number
  ): UploadedImage {
    return {
      url: secureUrl,
      publicId,
      width,
      height,
      format,
      bytes,
      optimizedUrls: {
        thumbnail: getOptimizedUrl(publicId, 200, 200),
        medium: getOptimizedUrl(publicId, 600, undefined),
        large: getOptimizedUrl(publicId, 1200, undefined),
      },
    };
  }

  /**
   * Format multiple uploaded images
   */
  static formatBatchImages(
    uploads: Array<{
      public_id: string;
      secure_url: string;
      width: number;
      height: number;
      format: string;
      bytes: number;
    }>
  ): UploadedImage[] {
    return uploads.map((img) =>
      this.formatSingleImage(
        img.public_id,
        img.secure_url,
        img.width,
        img.height,
        img.format,
        img.bytes
      )
    );
  }

  /**
   * Format response for single image upload
   */
  static formatResponse(image: UploadedImage) {
    return {
      success: true,
      data: image,
      message: "ছবি সফলভাবে আপলোড হয়েছে।",
    };
  }

  /**
   * Format response for batch upload
   */
  static formatBatchResponse(images: UploadedImage[], totalSize: number) {
    return {
      success: true,
      data: {
        images,
        count: images.length,
        totalSize,
      },
      message: `${images.length}টি ছবি সফলভাবে আপলোড হয়েছে।`,
    };
  }

  /**
   * Get simplified format for product/category creation
   * (just url and publicId - what the schema expects)
   */
  static getProductImageFormat(image: UploadedImage) {
    return {
      url: image.url,
      publicId: image.publicId,
    };
  }

  /**
   * Format multiple images for product creation
   */
  static getProductImagesFormat(images: UploadedImage[]) {
    return images.map((img) => ({
      url: img.url,
      publicId: img.publicId,
    }));
  }
}
