"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ProductForm } from "./ProductForm";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
  type Product,
} from "@/redux/api/productApi";
import type { CreateProductInput } from "@our-sunnah/validation";

type ProductFormModalProps = {
  open: boolean;
  onClose: () => void;
  product?: Product;
};

function toFormDefaults(product: Product): Partial<CreateProductInput> {
  return {
    name: product.name,
    shortDescription: product.shortDescription ?? undefined,
    description: product.description,
    sku: product.sku ?? undefined,
    brand: product.brand ?? undefined,
    price: parseFloat(product.price),
    compareAtPrice: product.compareAtPrice
      ? parseFloat(product.compareAtPrice)
      : undefined,
    stock: product.stock,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    isBestSeller: product.isBestSeller,
    metaTitle: product.metaTitle ?? undefined,
    metaDescription: product.metaDescription ?? undefined,
    categoryIds: (product.categories ?? []).map((c) => c.id),
    images: (product.images ?? []).map(({ url, publicId, position }) => ({
      url,
      publicId,
      position,
    })),
    attributes: (product.attributes ?? []).map(({ key, value, position }) => ({
      key,
      value,
      position,
    })),
    options: (product.options ?? []).map((opt) => ({
      name: opt.name,
      values: (opt.values ?? []).map((v) => v.value),
    })),
    variants: (product.variants ?? []).map((v) => ({
      sku: v.sku ?? undefined,
      price: v.price ? parseFloat(v.price) : undefined,
      stock: v.stock,
      image: v.image ?? undefined,
      optionValues: Object.fromEntries(
        (v.optionValues ?? []).map((ov) => [ov.option.name, ov.value])
      ),
    })),
  };
}

export function ProductFormModal({ open, onClose, product }: ProductFormModalProps) {
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const isEditing = Boolean(product);
  const isLoading = isCreating || isUpdating;

  // Now receives FormData (multipart: data field + image files)
  const handleSubmit = async (formData: FormData) => {
    try {
      if (isEditing && product) {
        await updateProduct({ id: product.id, body: formData }).unwrap();
      } else {
        await createProduct(formData).unwrap();
      }
      onClose();
    } catch (err) {
      console.error("Failed to save product:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the product details below"
              : "Fill in the details to add a new product to the catalog"}
          </DialogDescription>
        </DialogHeader>

        <ProductForm
          defaultValues={product ? toFormDefaults(product) : undefined}
          initialData={product}
          initialImages={product?.images ?? []}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
