import { CreateProductInput } from "@our-sunnah/validation";
import { ImageFile } from "./useImageHandler";

export interface FormDataPayload extends Omit<CreateProductInput, "images"> {
  images?: Array<{
    url: string;
    publicId: string;
    position: number;
  }>;
}

export function useProductForm() {
  /**
   * Build FormData object for multipart submission
   * Separates product data (stringified) from image files
   */
  const buildFormData = (
    values: CreateProductInput,
    selectedFiles: ImageFile[]
  ): FormData => {
    const formData = new FormData();

    // Prepare product data (without files)
    const productData: FormDataPayload = {
      name: values.name,
      description: values.description,
      shortDescription: values.shortDescription,
      sku: values.sku,
      brand: values.brand,
      price: values.price,
      compareAtPrice: values.compareAtPrice,
      stock: values.stock,
      isActive: values.isActive,
      isFeatured: values.isFeatured,
      metaTitle: values.metaTitle,
      metaDescription: values.metaDescription,
      categoryIds: values.categoryIds,
      attributes: values.attributes,
      options: values.options,
      variants: values.variants,
      images: [], // Backend will fill this with uploaded images
    };

    // Add product data as JSON stringified field
    formData.append("data", JSON.stringify(productData));

    // Add selected image files
    selectedFiles.forEach((img) => {
      formData.append("images", img.file);
    });

    return formData;
  };

  /**
   * Build FormData for update requests
   * Only includes changed fields
   */
  const buildUpdateFormData = (
    values: Partial<CreateProductInput>,
    selectedFiles: ImageFile[]
  ): FormData => {
    const formData = new FormData();

    // Prepare only the fields that are being updated
    const updateData: Record<string, any> = {};

    if (values.name !== undefined) updateData.name = values.name;
    if (values.description !== undefined) updateData.description = values.description;
    if (values.shortDescription !== undefined)
      updateData.shortDescription = values.shortDescription;
    if (values.sku !== undefined) updateData.sku = values.sku;
    if (values.brand !== undefined) updateData.brand = values.brand;
    if (values.price !== undefined) updateData.price = values.price;
    if (values.compareAtPrice !== undefined)
      updateData.compareAtPrice = values.compareAtPrice;
    if (values.stock !== undefined) updateData.stock = values.stock;
    if (values.isActive !== undefined) updateData.isActive = values.isActive;
    if (values.isFeatured !== undefined) updateData.isFeatured = values.isFeatured;
    if (values.metaTitle !== undefined) updateData.metaTitle = values.metaTitle;
    if (values.metaDescription !== undefined)
      updateData.metaDescription = values.metaDescription;
    if (values.categoryIds !== undefined) updateData.categoryIds = values.categoryIds;
    if (values.attributes !== undefined) updateData.attributes = values.attributes;
    if (values.options !== undefined) updateData.options = values.options;
    if (values.variants !== undefined) updateData.variants = values.variants;

    // Include images if files are being uploaded
    if (selectedFiles.length > 0) {
      updateData.images = [];
    }

    formData.append("data", JSON.stringify(updateData));

    // Add selected files
    selectedFiles.forEach((img) => {
      formData.append("images", img.file);
    });

    return formData;
  };

  /**
   * Check if form has actual changes (for update detection)
   */
  const hasChanges = (
    originalValues: CreateProductInput,
    currentValues: CreateProductInput
  ): boolean => {
    const keys = Object.keys(currentValues) as Array<keyof CreateProductInput>;

    for (const key of keys) {
      const original = originalValues[key];
      const current = currentValues[key];

      // Handle arrays
      if (Array.isArray(original) && Array.isArray(current)) {
        if (JSON.stringify(original) !== JSON.stringify(current)) {
          return true;
        }
      } else if (original !== current) {
        return true;
      }
    }

    return false;
  };

  return {
    buildFormData,
    buildUpdateFormData,
    hasChanges,
  };
}
