"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCategorySchema, type CreateCategoryInput } from "@our-sunnah/validation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SimpleSelect } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { TCategoryTree } from "@/redux/api/categoryApi";

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateCategoryInput) => Promise<void>;
  isLoading: boolean;
  categories: TCategoryTree[];
  editValues?: Partial<CreateCategoryInput & { id: string }>;
  mode: "create" | "edit";
}

function flattenTree(
  categories: TCategoryTree[],
  excludeId?: string,
  depth = 0
): { value: string; label: string }[] {
  return categories.flatMap((cat) => {
    if (cat.id === excludeId) return [];
    const prefix = depth > 0 ? "—".repeat(depth) + " " : "";
    return [
      { value: cat.id, label: `${prefix}${cat.name}` },
      ...flattenTree(cat.children ?? [], excludeId, depth + 1),
    ];
  });
}

export function CategoryForm({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  categories,
  editValues,
  mode,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
      parentId: null,
      position: 0,
      isFeatured: false,
    },
  });

  useEffect(() => {
    if (editValues) {
      reset({
        name: editValues.name ?? "",
        description: editValues.description ?? "",
        image: editValues.image ?? "",
        parentId: editValues.parentId ?? null,
        position: editValues.position ?? 0,
        isFeatured: editValues.isFeatured ?? false,
      });
    } else {
      reset({ name: "", description: "", image: "", parentId: null, position: 0, isFeatured: false });
    }
  }, [editValues, reset, open]);

  const parentOptions = [
    { value: "", label: "None (Root category)" },
    ...flattenTree(categories, editValues?.id),
  ];

  const selectedParent = watch("parentId");
  const isFeatured = watch("isFeatured");

  const handleFormSubmit = async (data: CreateCategoryInput) => {
    await onSubmit({ ...data, parentId: data.parentId || null });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add Category" : "Edit Category"}</DialogTitle>
          <DialogDescription>
            {mode === "create" ? "Create a new product category" : "Update category details"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Input
            label="Category Name"
            placeholder="e.g. Prayer Essentials"
            error={errors.name?.message}
            {...register("name")}
          />

          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-widest text-brand-stone font-sans">
              Description
              <span className="normal-case tracking-normal text-brand-stone/60 ml-1">(optional)</span>
            </label>
            <textarea
              placeholder="Short description of this category..."
              rows={3}
              className="w-full rounded-lg border border-brand-beige-dark bg-white px-3 py-2 text-sm font-sans text-brand-charcoal placeholder:text-brand-stone/50 focus:outline-none focus:ring-2 focus:ring-brand-emerald/30 focus:border-brand-emerald resize-none transition-colors"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-red-500 font-sans">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-widest text-brand-stone font-sans">
              Parent Category
              <span className="normal-case tracking-normal text-brand-stone/60 ml-1">(optional)</span>
            </label>
            <SimpleSelect
              options={parentOptions}
              value={selectedParent ?? ""}
              onValueChange={(val) => setValue("parentId", val || null)}
              placeholder="None (Root category)"
            />
            {errors.parentId && (
              <p className="text-xs text-red-500 font-sans">{errors.parentId.message}</p>
            )}
          </div>

          <Input
            label="Image URL"
            placeholder="https://..."
            error={errors.image?.message}
            {...register("image")}
          />

          <Input
            label="Display Order"
            type="number"
            placeholder="0"
            hint="Lower number = shown first"
            error={errors.position?.message}
            {...register("position", {
              setValueAs: (v) => (v === "" || isNaN(Number(v)) ? 0 : Number(v)),
            })}
          />

          <div className="flex items-center justify-between rounded-lg border border-brand-beige-dark bg-brand-cream px-4 py-3">
            <div>
              <p className="text-sm font-sans text-brand-charcoal">Featured on Homepage</p>
              <p className="text-xs text-brand-stone font-sans mt-0.5">
                Show in the &quot;Our Collections&quot; section
              </p>
            </div>
            <Switch
              checked={isFeatured ?? false}
              onCheckedChange={(val) => setValue("isFeatured", val)}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isLoading}>Cancel</Button>
            </DialogClose>
            <Button type="submit" variant="gold" loading={isLoading}>
              {mode === "create" ? "Create Category" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
