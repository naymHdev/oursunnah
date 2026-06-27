import { useState, useCallback } from "react";

export interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

export interface ImageData {
  url: string;
  publicId: string;
  position: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_FILES = 10;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function useImageHandler() {
  const [selectedFiles, setSelectedFiles] = useState<ImageFile[]>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [error, setError] = useState<string>("");

  const validateFile = (file: File): ValidationResult => {
    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: `Invalid file type: ${file.name}. Only JPEG, PNG, WebP, and GIF are allowed.`,
      };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File too large: ${file.name}. Maximum size is 5MB.`,
      };
    }

    return { isValid: true };
  };

  const validateBatch = (files: File[]): ValidationResult => {
    let newTotalSize = totalSize;

    for (const file of files) {
      // Validate individual file
      const fileValidation = validateFile(file);
      if (!fileValidation.isValid) {
        return fileValidation;
      }

      newTotalSize += file.size;
    }

    // Check total size
    if (newTotalSize > MAX_TOTAL_SIZE) {
      return {
        isValid: false,
        error: `Total size exceeds 50MB limit.`,
      };
    }

    // Check file count
    if (selectedFiles.length + files.length > MAX_FILES) {
      return {
        isValid: false,
        error: `Cannot upload more than ${MAX_FILES} files.`,
      };
    }

    return { isValid: true };
  };

  const addFiles = useCallback(
    (files: File[]) => {
      setError("");

      // Validate batch
      const validation = validateBatch(files);
      if (!validation.isValid) {
        setError(validation.error || "Validation failed");
        return false;
      }

      // Create image objects with previews
      const newImages: ImageFile[] = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        id: `img_${Date.now()}_${Math.random()}`,
      }));

      setSelectedFiles((prev) => [...prev, ...newImages]);
      setTotalSize((prev) => prev + files.reduce((sum, f) => sum + f.size, 0));

      return true;
    },
    [selectedFiles.length, totalSize]
  );

  const removeFile = useCallback((id: string) => {
    setSelectedFiles((prev) => {
      const removed = prev.find((img) => img.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.preview);
        setTotalSize((s) => s - removed.file.size);
      }
      return prev.filter((img) => img.id !== id);
    });
  }, []);

  const reorderFiles = useCallback((startIndex: number, endIndex: number) => {
    setSelectedFiles((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

  const clearAll = useCallback(() => {
    selectedFiles.forEach((img) => URL.revokeObjectURL(img.preview));
    setSelectedFiles([]);
    setTotalSize(0);
    setError("");
  }, [selectedFiles]);

  return {
    selectedFiles,
    totalSize,
    error,
    setError,
    addFiles,
    removeFile,
    reorderFiles,
    clearAll,
    fileCount: selectedFiles.length,
  };
}
