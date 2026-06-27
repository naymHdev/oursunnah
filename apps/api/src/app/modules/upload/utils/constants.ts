/**
 * Upload configuration constants
 */

export const UPLOAD_LIMITS = {
  SINGLE_FILE_SIZE_MB: 5,
  SINGLE_FILE_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
  BATCH_TOTAL_SIZE_MB: 50,
  BATCH_TOTAL_SIZE_BYTES: 50 * 1024 * 1024, // 50MB
  MAX_FILES_PER_BATCH: 10,
  MAX_IMAGE_DIMENSIONS: 10000, // width/height in px
};

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

export const CLOUDINARY_FOLDERS = {
  PRODUCTS: "our-sunnah/products",
  CATEGORIES: "our-sunnah/categories",
} as const;

export const IMAGE_OPTIMIZATION = {
  QUALITY: 80, // 0-100, default cloudinary is 80
  DEFAULT_WIDTH: 800, // responsive fallback width
  THUMBNAIL_WIDTH: 200,
  CROP: "auto", // let cloudinary decide
  FORMAT: "auto", // webp for modern browsers, fallback jpg
} as const;

export const CACHE_CONTROL = {
  PUBLIC_MAX_AGE: 31536000, // 1 year (365 days)
  PRODUCT_IMAGES: "public, max-age=31536000, immutable",
  CATEGORY_IMAGES: "public, max-age=31536000, immutable",
} as const;
