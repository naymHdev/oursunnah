import multer, { MulterError } from "multer";
import { ALLOWED_MIME_TYPES, UPLOAD_LIMITS } from "./utils/constants.js";
import { ErrorMessages } from "./utils/error-messages.js";

/**
 * Multer config with memory storage
 * Files are stored in memory (buffer) for direct streaming to Cloudinary
 * No temporary files on disk = faster processing
 */
const storage = multer.memoryStorage();

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(new Error(ErrorMessages.INVALID_FILE_TYPE));
  } else {
    cb(null, true);
  }
};

/**
 * Single file upload middleware
 */
export const uploadSingle = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: UPLOAD_LIMITS.SINGLE_FILE_SIZE_BYTES,
    files: 1,
  },
}).single("image");

/**
 * Multiple files upload middleware
 */
export const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: UPLOAD_LIMITS.SINGLE_FILE_SIZE_BYTES, // per file
    files: UPLOAD_LIMITS.MAX_FILES_PER_BATCH,
  },
}).array("images", UPLOAD_LIMITS.MAX_FILES_PER_BATCH);

/**
 * Error handler for multer
 */
export const handleMulterErrors = (
  err: any,
  _req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) => {
  if (err instanceof MulterError) {
    let message = ErrorMessages.INTERNAL_SERVER_ERROR;

    switch (err.code) {
      case "LIMIT_PART_COUNT":
        message = ErrorMessages.TOO_MANY_FILES(UPLOAD_LIMITS.MAX_FILES_PER_BATCH);
        break;
      case "LIMIT_FILE_SIZE":
        message = ErrorMessages.FILE_TOO_LARGE(
          UPLOAD_LIMITS.SINGLE_FILE_SIZE_MB
        );
        break;
      case "LIMIT_FILE_COUNT":
        message = ErrorMessages.TOO_MANY_FILES(UPLOAD_LIMITS.MAX_FILES_PER_BATCH);
        break;
      case "LIMIT_UNEXPECTED_FILE":
        message = "অপ্রত্যাশিত ফাইল ক্ষেত্র।";
        break;
      case "LIMIT_FIELD_KEY":
        message = "ফাইল ফিল্ড নাম খুবই দীর্ঘ।";
        break;
      case "LIMIT_FIELD_VALUE":
        message = "ফাইল ফিল্ড মান খুবই দীর্ঘ।";
        break;
    }

    return res.status(400).json({
      success: false,
      message,
      data: null,
    });
  }

  if (err instanceof Error) {
    return res.status(400).json({
      success: false,
      message: err.message,
      data: null,
    });
  }

  next(err);
};
