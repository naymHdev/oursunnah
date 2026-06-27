import {
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  UPLOAD_LIMITS,
} from "./constants.js";
import { ErrorMessages } from "./error-messages.js";

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  warnings?: string[];
}

export class FileValidator {
  /**
   * Validate single file
   */
  static validateFile(
    file: Express.Multer.File,
    maxSizeMB?: number
  ): FileValidationResult {
    const maxSize = (maxSizeMB || UPLOAD_LIMITS.SINGLE_FILE_SIZE_MB) * 1024 * 1024;

    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return {
        isValid: false,
        error: ErrorMessages.INVALID_FILE_TYPE,
      };
    }

    // Check file extension
    const ext = this.getFileExtension(file.originalname);
    if (!ALLOWED_EXTENSIONS.includes(ext.toLowerCase())) {
      return {
        isValid: false,
        error: ErrorMessages.INVALID_FILE_EXTENSION,
      };
    }

    // Check file size
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: ErrorMessages.FILE_TOO_LARGE(
          maxSizeMB || UPLOAD_LIMITS.SINGLE_FILE_SIZE_MB
        ),
      };
    }

    // Check if file has buffer
    if (!file.buffer || file.buffer.length === 0) {
      return {
        isValid: false,
        error: ErrorMessages.EMPTY_FILE,
      };
    }

    return { isValid: true };
  }

  /**
   * Validate multiple files (batch)
   */
  static validateBatch(files: Express.Multer.File[]): FileValidationResult {
    const warnings: string[] = [];
    let totalSize = 0;

    // Check file count
    if (files.length === 0) {
      return {
        isValid: false,
        error: ErrorMessages.NO_FILES_PROVIDED,
      };
    }

    if (files.length > UPLOAD_LIMITS.MAX_FILES_PER_BATCH) {
      return {
        isValid: false,
        error: ErrorMessages.TOO_MANY_FILES(UPLOAD_LIMITS.MAX_FILES_PER_BATCH),
      };
    }

    // Validate each file
    for (const file of files) {
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        return {
          isValid: false,
          error: `${file.originalname}: ${validation.error}`,
        };
      }

      totalSize += file.size;
    }

    // Check total batch size
    if (totalSize > UPLOAD_LIMITS.BATCH_TOTAL_SIZE_BYTES) {
      return {
        isValid: false,
        error: ErrorMessages.BATCH_TOO_LARGE(
          UPLOAD_LIMITS.BATCH_TOTAL_SIZE_MB
        ),
      };
    }

    // Warn if close to limit
    if (totalSize > UPLOAD_LIMITS.BATCH_TOTAL_SIZE_BYTES * 0.8) {
      warnings.push(
        `মোট ফাইল সাইজ ৮০% লিমিটের কাছাকাছি (${this.formatBytes(totalSize)} / ${UPLOAD_LIMITS.BATCH_TOTAL_SIZE_MB}MB)`
      );
    }

    return { isValid: true, warnings };
  }

  /**
   * Extract file extension
   */
  private static getFileExtension(filename: string): string {
    const match = filename.match(/\.[^.]+$/);
    return match ? match[0] : "";
  }

  /**
   * Format bytes to human-readable format
   */
  private static formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }
}
