"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema, type CreateProductInput } from "@our-sunnah/validation";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { useGetCategoryTreeQuery } from "@/redux/api/categoryApi";
import type { Product } from "@/redux/api/productApi";

type ProductFormProps = {
  defaultValues?: Partial<CreateProductInput>;
  initialData?: Product;
  onSubmit: (data: CreateProductInput) => Promise<void>;
  isLoading: boolean;
};

function flattenCategories(
  categories: { id: string; name: string; children?: { id: string; name: string }[] }[]
): { id: string; name: string }[] {
  return categories.flatMap((c) => [c, ...(c.children ?? [])]);
}

const SECTION = "flex flex-col gap-3 p-4 rounded-lg border border-brand-beige-dark bg-white";
const SECTION_TITLE = "text-xs font-medium uppercase tracking-widest text-brand-stone font-sans";

export function ProductForm({ defaultValues, initialData, onSubmit, isLoading }: ProductFormProps) {
  const { data: categoryData } = useGetCategoryTreeQuery();
  const categories = flattenCategories(categoryData?.data ?? []);

  // Track which optional sections are expanded
  const [showAttributes, setShowAttributes] = useState(
    (initialData?.attributes.length ?? 0) > 0
  );
  const [showVariants, setShowVariants] = useState(
    (initialData?.options.length ?? 0) > 0
  );
  const [showSeo, setShowSeo] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateProductInput>({
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

  const selectedCategoryIds = useWatch({ control, name: "categoryIds" });

  // Field arrays
  const {
    fields: attrFields,
    append: appendAttr,
    remove: removeAttr,
  } = useFieldArray({ control, name: "attributes" });

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

  const toggleCategory = (id: string) => {
    const current = selectedCategoryIds ?? [];
    const next = current.includes(id)
      ? current.filter((c: string) => c !== id)
      : [...current, id];
    setValue("categoryIds", next, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* ── BASIC INFO ── */}
      <div className={SECTION}>
        <p className={SECTION_TITLE}>Basic Information</p>

        <div className="grid grid-cols-2 gap-3">
          <FormField<CreateProductInput>
            name="name"
            control={control}
            label="Product Name"
            placeholder="e.g. Sunnah Oud Perfume"
          />
          <FormField<CreateProductInput>
            name="brand"
            control={control}
            label="Brand"
            placeholder="Optional"
          />
        </div>

        <FormField<CreateProductInput>
          name="shortDescription"
          control={control}
          label="Short Description"
          placeholder="Brief tagline shown in listings"
        />

        <div className="flex flex-col gap-1.5">
          <label className={SECTION_TITLE}>Description *</label>
          <textarea
            {...register("description")}
            rows={4}
            placeholder="Full product description (min 10 characters)"
            className="w-full rounded-md border border-brand-beige-dark bg-white px-3 py-2 text-sm font-sans text-brand-charcoal placeholder:text-brand-stone/60 focus:outline-none focus:ring-2 focus:ring-brand-emerald/30 focus:border-brand-emerald transition-colors resize-none"
          />
          {errors.description && (
            <p className="text-xs text-red-500 font-sans">{errors.description.message}</p>
          )}
        </div>
      </div>

      {/* ── PRICING & STOCK ── */}
      <div className={SECTION}>
        <p className={SECTION_TITLE}>Pricing & Stock</p>

        <div className="grid grid-cols-3 gap-3">
          <FormField<CreateProductInput>
            name="price"
            control={control}
            label="Price ($) *"
            type="number"
            step="0.01"
            placeholder="0.00"
          />
          <FormField<CreateProductInput>
            name="compareAtPrice"
            control={control}
            label="Compare At ($)"
            type="number"
            step="0.01"
            placeholder="Optional"
          />
          <FormField<CreateProductInput>
            name="stock"
            control={control}
            label="Stock *"
            type="number"
            placeholder="0"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField<CreateProductInput>
            name="sku"
            control={control}
            label="SKU"
            placeholder="Unique identifier (optional)"
          />
          <div className="flex items-end gap-6 pb-1">
            <label className="flex items-center gap-2 text-sm font-sans text-brand-charcoal cursor-pointer">
              <input type="checkbox" {...register("isActive")} className="rounded" />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm font-sans text-brand-charcoal cursor-pointer">
              <input type="checkbox" {...register("isFeatured")} className="rounded" />
              Featured
            </label>
          </div>
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <div className={SECTION}>
        <p className={SECTION_TITLE}>Categories *</p>
        {categories.length === 0 ? (
          <p className="text-xs text-brand-stone font-sans">Loading categories…</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const selected = selectedCategoryIds?.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`rounded-full px-3 py-1 text-xs font-sans font-medium border transition-colors ${
                    selected
                      ? "bg-brand-gold text-brand-cream border-brand-gold"
                      : "bg-white text-brand-charcoal border-brand-beige-dark hover:border-brand-gold"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        )}
        {errors.categoryIds && (
          <p className="text-xs text-red-500 font-sans">{errors.categoryIds.message}</p>
        )}
      </div>

      {/* ── IMAGE ── */}
      <div className={SECTION}>
        <p className={SECTION_TITLE}>Primary Image</p>
        <Input
          label="Image URL"
          placeholder="https://cdn.example.com/product.jpg"
          defaultValue={initialData?.images[0]?.url ?? ""}
          onChange={(e) => {
            const url = e.target.value.trim();
            setValue(
              "images",
              url ? [{ url, publicId: url, position: 0 }] : [],
              { shouldValidate: true }
            );
          }}
        />
        <p className="text-xs text-brand-stone font-sans">
          Enter a direct image URL. Multiple image upload will be supported in the next iteration.
        </p>
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
            <span className="text-brand-stone/60">
              (optional — e.g. Material, Weight, Origin)
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
                  className="mt-0 shrink-0 text-red-400 hover:text-red-600"
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
              <Plus className="h-3.5 w-3.5" /> Add Attribute
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
            <span className="text-brand-stone/60">
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
              <p className="text-xs uppercase tracking-widest text-brand-stone font-sans">
                Options
              </p>
              {optionFields.map((field, idx) => (
                <div key={field.id} className="p-3 rounded-md border border-brand-beige-dark bg-brand-cream/30 space-y-2">
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
                <Plus className="h-3.5 w-3.5" /> Add Option
              </Button>
            </div>

            {/* Variants */}
            {optionFields.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-widest text-brand-stone font-sans">
                  Variants
                </p>
                {variantFields.map((field, idx) => (
                  <div key={field.id} className="p-3 rounded-md border border-brand-beige-dark bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-brand-stone font-sans">Variant {idx + 1}</span>
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
                        label="Price ($)"
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
                  onClick={() =>
                    appendVariant({ optionValues: {}, stock: 0 })
                  }
                >
                  <Plus className="h-3.5 w-3.5" /> Add Variant
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
          <span className={SECTION_TITLE}>SEO <span className="text-brand-stone/60">(optional)</span></span>
          {showSeo ? (
            <ChevronUp className="h-4 w-4 text-brand-stone" />
          ) : (
            <ChevronDown className="h-4 w-4 text-brand-stone" />
          )}
        </button>

        {showSeo && (
          <div className="px-4 pb-4 border-t border-brand-beige-dark pt-3 grid grid-cols-2 gap-3">
            <FormField<CreateProductInput>
              name="metaTitle"
              control={control}
              label="Meta Title"
              placeholder="SEO page title"
            />
            <FormField<CreateProductInput>
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
