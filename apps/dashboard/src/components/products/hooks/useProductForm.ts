import { useCallback } from "react";
import type { CreateProductInput } from "@our-sunnah/validation";
import type { ImageFile } from "./useImageHandler";

export function useProductForm() {
  const buildFormData = useCallback(
    (values: CreateProductInput, selectedFiles: ImageFile[]) => {
      const formData = new FormData();

      // Separate existing images (already on Cloudinary) from new file uploads
      const existingImages = selectedFiles
        .filter((f) => f.file === null)
        .map((f, position) => ({
          url: f.url!,
          publicId: f.publicId!,
          position,
        }));

      const newFiles = selectedFiles.filter((f) => f.file !== null);

      // Merge existing image metadata into values so backend keeps them
      const payload = {
        ...values,
        images: existingImages,
      };

      formData.append("data", JSON.stringify(payload));

      // Append only new file uploads
      newFiles.forEach((imgFile) => {
        formData.append("images", imgFile.file!);
      });

      return formData;
    },
    []
  );

  return { buildFormData };
}
