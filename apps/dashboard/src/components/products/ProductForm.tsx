"use client";

import { useForm, useFieldArray, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createProductSchema, type CreateProductInput } from "@our-sunnah/validation";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { useGetCategoryTreeQuery } from "@/redux/api/categoryApi";
import type { Product } from "@/redux/api/productApi";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { CategoryTreeSelector } from "./CategoryTreeSelector";
import { ImageUploadSection } from "./sections/ImageUploadSection";
import { useImageHandler } from "./hooks/useImageHandler";
import { useProductForm } from "./hooks/useProductForm";

// ── Types ────────────────────────────────────────────────────────────────────

type ProductFormValues = z.input<typeof createProductSchema>;

type ProductFormProps = {
  defaultValues?: Partial<CreateProductInput>;
  initialData?: Product;
  /** Receives a ready-to-send FormData (multipart: data + image files) */
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
};

// ── Constants ─────────────────────────────────────────────────────────────────

const SECTION =
  "flex flex-col gap-4 p-4 rounded-lg border border-brand-beige-dark bg-white";
const SECTION_TITLE =
  "text-xs font-medium uppercase tracking-widest text-brand-stone font-sans";

// ── Component ─────────────────────────────────────────────────────────────────

export function ProductForm({
  defaultValues,
  initialData,
  onSubmit,
  isLoading,
}: ProductFormProps) {
  // Category tree from API
  const { data: categoryTree = [] } = useGetCategoryTreeQuery();

  // Collapsible optional sections
  const [showAttributes, setShowAttributes] = useState(
    (initialData?.attributes.length ?? 0) > 0
  );
  const [showVariants, setShowVariants] = useState(
    (initialData?.options.length ?? 0) > 0
  );
  const [showSeo, setShowSeo] = useState(false);

  // Image files handled by custom hook
  const { selectedFiles, error: imageError, addFiles, removeFile, reorderFiles } =
    useImageHandler();

  // FormData builder
  const { buildFormData } = useProductForm();

  // ── React Hook Form ────────────────────────────────────────────────────────

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues, unknown, CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      categoryIds: [],
      images: [],
      attributes: [],
      options: [],
      variants: [],
      isActive: true,
      isFeatured: false,
      ...defaultValues,
    },
  });

  const selectedCategoryIds: string[] = useWatch({ control, name: "categoryIds" }) ?? [];

  // Field arrays
  const { fields: attrFields, append: appendAttr, remove: removeAttr } = useFieldArray({
    control,
    name: "attributes",
  });
  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({ control, name: "options" });
  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({ control, name: "variants" });

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleFormSubmit = async (values: CreateProductInput) => {
    const formData = buildFormData(values, selectedFiles);
    await onSubmit(formData);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">

      {/* ── BASIC INFO ── */}
      <div className={SECTION}>
        <p className={SECTION_TITLE}>Basic Information</p>

        <div className="grid grid-cols-2 gap-3">
          <FormField<ProductFormValues>
            name="name"
            control={control}
            label="Product Name *"
            placeholder="e.g. Sunnah Oud Perfume"
          />
          <FormField<ProductFormValues>
            name="brand"
            control={control}
            label="Brand"
            placeholder="Optional"
          />
        </div>

        <FormField<ProductFormValues>
          name="shortDescription"
          control={control}
          label="Short Description"
          placeholder="Brief tagline shown in listings"
        />

        <FormField<ProductFormValues>
          name="sku"
          control={control}
          label="SKU"
          placeholder="Unique identifier (optional)"
        />

        {/* TipTap Rich Text Editor for description */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <RichTextEditor
              label="Description"
              value={field.value ?? ""}
              onChange={field.onChange}
              error={errors.description?.message}
            />
          )}
        />
      </div>

      {/* ── PRICING & STOCK ── */}
      <div className={SECTION}>
        <p className={SECTION_TITLE}>Pricing & Stock</p>

        <div className="grid grid-cols-3 gap-3">
          <FormField<ProductFormValues>
            name="price"
            control={control}
            label="Price *"
            type="number"
            step="0.01"
            placeholder="0.00"
          />
          <FormField<ProductFormValues>
            name="compareAtPrice"
            control={control}
            label="Compare At"
            type="number"
            step="0.01"
            placeholder="Optional"
          />
          <FormField<ProductFormValues>
            name="stock"
            control={control}
            label="Stock *"
            type="number"
            placeholder="0"
          />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm font-sans text-brand-charcoal cursor-pointer select-none">
            <input
              type="checkbox"
              {...register("isActive")}
              className="h-4 w-4 rounded border-brand-beige-dark text-brand-gold focus:ring-brand-gold"
            />
            Active
          </label>
          <label className="flex items-center gap-2 text-sm font-sans text-brand-charcoal cursor-pointer select-none">
            <input
              type="checkbox"
              {...register("isFeatured")}
              className="h-4 w-4 rounded border-brand-beige-dark text-brand-gold focus:ring-brand-gold"
            />
            Featured
          </label>
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <div className={SECTION}>
        <p className={SECTION_TITLE}>Categories *</p>
        <CategoryTreeSelector
          categories={categoryTree}
          selectedIds={selectedCategoryIds}
          onChange={(ids) => setValue("categoryIds", ids, { shouldValidate: true })}
          error={errors.categoryIds?.message}
        />
      </div>

      {/* ── IMAGES ── */}
      <div className={SECTION}>
        <ImageUploadSection
          selectedFiles={selectedFiles}
          onAddFiles={addFiles}
          onRemoveFile={removeFile}
          onReorderFiles={reorderFiles}
          uploadError={imageError}
        />
      </div>

      {/* ── ATTRIBUTES (collapsible) ── */}
      <div className="rounded-lg border border-brand-beige-dark bg-white overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAttributes((s) => !s)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-brand-cream/50 transition-colors"
        >
          <span className={SECTION_TITLE}>
            Attributes{" "}
            <span className="font-normal text-brand-stone/60 normal-case tracking-normal">
              (optional — e.g. Material, Weight)
            </span>
          </span>
          {showAttributes ? (
            <ChevronUp className="h-4 w-4 text-brand-stone" />
          ) : (
            <ChevronDown className="h-4 w-4 text-brand-stone" />
          )}
        </button>

        {showAttributes && (
          <div className="px-4 pb-4 space-y-2 border-t border-brand-beige-dark pt-3">
            {attrFields.map((field, idx) => (
              <div key={field.id} className="flex items-start gap-2">
                <Input
                  {...register(`attributes.${idx}.key`)}
                  placeholder="Key (e.g. Material)"
                  error={errors.attributes?.[idx]?.key?.message}
                />
                <Input
                  {...register(`attributes.${idx}.value`)}
                  placeholder="Value (e.g. Cotton)"
                  error={errors.attributes?.[idx]?.value?.message}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-red-400 hover:text-red-600"
                  onClick={() => removeAttr(idx)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendAttr({ key: "", value: "", position: attrFields.length })}
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Attribute
            </Button>
          </div>
        )}
      </div>

      {/* ── OPTIONS & VARIANTS (collapsible) ── */}
      <div className="rounded-lg border border-brand-beige-dark bg-white overflow-hidden">
        <button
          type="button"
          onClick={() => setShowVariants((s) => !s)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-brand-cream/50 transition-colors"
        >
          <span className={SECTION_TITLE}>
            Options & Variants{" "}
            <span className="font-normal text-brand-stone/60 normal-case tracking-normal">
              (optional — e.g. Size, Color)
            </span>
          </span>
          {showVariants ? (
            <ChevronUp className="h-4 w-4 text-brand-stone" />
          ) : (
            <ChevronDown className="h-4 w-4 text-brand-stone" />
          )}
        </button>

        {showVariants && (
          <div className="px-4 pb-4 border-t border-brand-beige-dark pt-3 space-y-4">
            {/* Options */}
            <div className="space-y-3">
              <p className={SECTION_TITLE}>Options</p>
              {optionFields.map((field, idx) => (
                <div
                  key={field.id}
                  className="p-3 rounded-md border border-brand-beige-dark bg-brand-cream/30 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <Input
                      {...register(`options.${idx}.name`)}
                      placeholder="Option name (e.g. Size)"
                      error={errors.options?.[idx]?.name?.message}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-red-400 hover:text-red-600"
                      onClick={() => removeOption(idx)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    {...register(`options.${idx}.values.0`)}
                    placeholder="Values, comma-separated (e.g. S, M, L, XL)"
                    hint="Enter each value separated by commas"
                    error={errors.options?.[idx]?.values?.message}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendOption({ name: "", values: [] })}
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Option
              </Button>
            </div>

            {/* Variants */}
            {optionFields.length > 0 && (
              <div className="space-y-3">
                <p className={SECTION_TITLE}>Variants</p>
                {variantFields.map((field, idx) => (
                  <div
                    key={field.id}
                    className="p-3 rounded-md border border-brand-beige-dark bg-white space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-brand-stone font-sans">
                        Variant {idx + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-400 hover:text-red-600"
                        onClick={() => removeVariant(idx)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        {...register(`variants.${idx}.sku`)}
                        label="SKU"
                        placeholder="Optional"
                      />
                      <Input
                        {...register(`variants.${idx}.price`, { valueAsNumber: true })}
                        label="Price"
                        type="number"
                        step="0.01"
                        placeholder="Optional"
                      />
                      <Input
                        {...register(`variants.${idx}.stock`, { valueAsNumber: true })}
                        label="Stock"
                        type="number"
                        placeholder="0"
                        error={errors.variants?.[idx]?.stock?.message}
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendVariant({ optionValues: {}, stock: 0 })}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Variant
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── SEO (collapsible) ── */}
      <div className="rounded-lg border border-brand-beige-dark bg-white overflow-hidden">
        <button
          type="button"
          onClick={() => setShowSeo((s) => !s)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-brand-cream/50 transition-colors"
        >
          <span className={SECTION_TITLE}>
            SEO{" "}
            <span className="font-normal text-brand-stone/60 normal-case tracking-normal">
              (optional)
            </span>
          </span>
          {showSeo ? (
            <ChevronUp className="h-4 w-4 text-brand-stone" />
          ) : (
            <ChevronDown className="h-4 w-4 text-brand-stone" />
          )}
        </button>

        {showSeo && (
          <div className="px-4 pb-4 border-t border-brand-beige-dark pt-3 grid grid-cols-2 gap-3">
            <FormField<ProductFormValues>
              name="metaTitle"
              control={control}
              label="Meta Title"
              placeholder="SEO page title"
            />
            <FormField<ProductFormValues>
              name="metaDescription"
              control={control}
              label="Meta Description"
              placeholder="SEO description"
            />
          </div>
        )}
      </div>

      {/* ── SUBMIT ── */}
      <Button type="submit" variant="gold" size="md" loading={isLoading} className="w-full">
        {isLoading ? "Saving…" : "Save Product"}
      </Button>
    </form>
  );
}
