"use client";

import { useState, useCallback } from "react";

export interface ImageFile {
  id: string;
  preview: string;
  // New file to be uploaded — null for existing (already-uploaded) images
  file: File | null;
  // Populated for existing images only
  url?: string;
  publicId?: string;
}

export interface ImageData {
  url: string;
  publicId: string;
  position: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;   // 5 MB
const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50 MB
const MAX_FILES = 10;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

interface UseImageHandlerOptions {
  // Pass existing images when editing a product so they pre-populate the grid.
  initialImages?: ImageData[];
}

export function useImageHandler({ initialImages = [] }: UseImageHandlerOptions = {}) {
  const [selectedFiles, setSelectedFiles] = useState<ImageFile[]>(() =>
    initialImages.map((img, i) => ({
      id: `existing_${i}_${img.publicId}`,
      preview: img.url,
      file: null,
      url: img.url,
      publicId: img.publicId,
    }))
  );
  const [totalSize, setTotalSize] = useState(0);
  const [error, setError] = useState<string>("");

  const newFileCount = selectedFiles.filter((f) => f.file !== null).length;

  const validateFile = (file: File): ValidationResult => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { isValid: false, error: `Invalid file type: ${file.name}. Only JPEG, PNG, WebP, and GIF are allowed.` };
    }
    if (file.size > MAX_FILE_SIZE) {
      return { isValid: false, error: `File too large: ${file.name}. Maximum size is 5 MB.` };
    }
    return { isValid: true };
  };

  const validateBatch = (files: File[]): ValidationResult => {
    let newTotalSize = totalSize;
    for (const file of files) {
      const v = validateFile(file);
      if (!v.isValid) return v;
      newTotalSize += file.size;
    }
    if (newTotalSize > MAX_TOTAL_SIZE) return { isValid: false, error: "Total size exceeds 50 MB limit." };
    if (selectedFiles.length + files.length > MAX_FILES) return { isValid: false, error: `Cannot upload more than ${MAX_FILES} files.` };
    return { isValid: true };
  };

  const addFiles = useCallback(
    (files: File[]) => {
      setError("");
      const validation = validateBatch(files);
      if (!validation.isValid) {
        setError(validation.error || "Validation failed");
        return false;
      }
      const newImages: ImageFile[] = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        id: `new_${Date.now()}_${Math.random()}`,
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
      if (removed?.file) {
        URL.revokeObjectURL(removed.preview);
        setTotalSize((s) => s - removed.file!.size);
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
    selectedFiles.forEach((img) => { if (img.file) URL.revokeObjectURL(img.preview); });
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
    newFileCount,
  };
}
