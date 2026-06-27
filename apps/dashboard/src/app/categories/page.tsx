"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { CategoryForm } from "@/components/categories/CategoryForm";
import {
  GripVertical,
  Pencil,
  Trash2,
  Plus,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  useGetCategoryTreeQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  type TCategoryTree,
} from "@/redux/api/categoryApi";
import type { CreateCategoryInput, UpdateCategoryInput } from "@our-sunnah/validation";

// ─── Category Row ────────────────────────────────────────────────────────────

function CategoryRow({
  cat,
  allCategories,
  depth = 0,
  onEdit,
  onDelete,
  onToggleActive,
  isTogglingId,
}: {
  cat: TCategoryTree;
  allCategories: TCategoryTree[];
  depth?: number;
  onEdit: (cat: TCategoryTree) => void;
  onDelete: (cat: TCategoryTree) => void;
  onToggleActive: (cat: TCategoryTree) => void;
  isTogglingId: string | null;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = cat.children && cat.children.length > 0;
  const isToggling = isTogglingId === cat.id;

  return (
    <>
      <div
        className={[
          "flex items-center gap-3 px-4 py-3 border-b border-brand-beige-dark/60",
          "hover:bg-brand-cream/60 transition-colors group",
          depth > 0 ? "pl-10 bg-brand-cream/30" : "",
        ].join(" ")}
      >
        {/* Drag handle */}
        <GripVertical className="h-4 w-4 text-brand-stone/40 cursor-grab shrink-0" />

        {/* Expand toggle */}
        {hasChildren ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-brand-stone hover:text-brand-charcoal transition-colors"
          >
            {expanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
        ) : (
          <span className="w-3.5" />
        )}

        {/* Name */}
        <span
          className={[
            "flex-1 font-sans text-sm",
            depth === 0
              ? "font-medium text-brand-charcoal"
              : "text-brand-charcoal/80",
          ].join(" ")}
        >
          {cat.name}
        </span>

        {/* Product count */}
        {cat._count?.products !== undefined && (
          <span className="text-xs font-sans text-brand-stone bg-brand-beige-dark/60 rounded-full px-2 py-0.5 min-w-[28px] text-center">
            {cat._count.products}
          </span>
        )}

        {/* Active toggle */}
        {isToggling ? (
          <Loader2 className="h-4 w-4 animate-spin text-brand-stone" />
        ) : (
          <Switch
            checked={cat.isActive}
            onCheckedChange={() => onToggleActive(cat)}
          />
        )}

        {/* Edit / Delete */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(cat)}
            className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-brand-cream transition-colors text-brand-stone hover:text-brand-charcoal"
            title="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(cat)}
            className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-red-50 transition-colors text-brand-stone hover:text-red-500"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Children */}
      {hasChildren &&
        expanded &&
        cat.children.map((child) => (
          <CategoryRow
            key={child.id}
            cat={child}
            allCategories={allCategories}
            depth={depth + 1}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleActive={onToggleActive}
            isTogglingId={isTogglingId}
          />
        ))}
    </>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CategoriesPage() {
  // API hooks
  const { data, isLoading, isError } = useGetCategoryTreeQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  // UI state
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editTarget, setEditTarget] = useState<TCategoryTree | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TCategoryTree | null>(null);
  const [isTogglingId, setIsTogglingId] = useState<string | null>(null);

  const categories = data?.data ?? [];

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleOpenCreate = () => {
    setEditTarget(null);
    setFormMode("create");
    setFormOpen(true);
  };

  const handleOpenEdit = (cat: TCategoryTree) => {
    setEditTarget(cat);
    setFormMode("edit");
    setFormOpen(true);
  };

  const handleOpenDelete = (cat: TCategoryTree) => {
    setDeleteTarget(cat);
  };

  const handleCreate = async (data: CreateCategoryInput) => {
    await createCategory(data).unwrap();
    setFormOpen(false);
  };

  const handleUpdate = async (data: CreateCategoryInput) => {
    if (!editTarget) return;
    await updateCategory({
      id: editTarget.id,
      body: data as UpdateCategoryInput,
    }).unwrap();
    setFormOpen(false);
    setEditTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteCategory(deleteTarget.id).unwrap();
    setDeleteTarget(null);
  };

  const handleToggleActive = async (cat: TCategoryTree) => {
    setIsTogglingId(cat.id);
    try {
      await updateCategory({
        id: cat.id,
        body: { isActive: !cat.isActive },
      }).unwrap();
    } finally {
      setIsTogglingId(null);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-brand-cream">
      <Sidebar />
      <div className="ml-60">
        <Header title="Categories" subtitle="Manage Product Hierarchy" />
        <main className="p-6">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs uppercase tracking-widest text-brand-stone font-sans">
              {categories.length} root{" "}
              {categories.length === 1 ? "category" : "categories"}
            </p>
            <Button variant="gold" onClick={handleOpenCreate}>
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-brand-gold" />
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
              <p className="text-sm font-sans text-red-600">
                Failed to load categories. Please refresh the page.
              </p>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && categories.length === 0 && (
            <div className="text-center py-20 border border-dashed border-brand-beige-dark rounded-xl">
              <p className="font-serif text-xl text-brand-charcoal mb-1">
                No categories yet
              </p>
              <p className="text-sm font-sans text-brand-stone mb-5">
                Create your first category to organise products
              </p>
              <Button variant="gold" onClick={handleOpenCreate}>
                <Plus className="h-4 w-4" />
                Add Category
              </Button>
            </div>
          )}

          {/* Tree */}
          {!isLoading && !isError && categories.length > 0 && (
            <Card>
              <div className="px-4 py-2.5 border-b border-brand-beige-dark">
                <p className="text-xs uppercase tracking-widest text-brand-stone font-sans flex items-center gap-1.5">
                  <GripVertical className="h-3.5 w-3.5" />
                  Drag to reorder
                </p>
              </div>
              <CardContent className="p-0">
                {categories.map((cat) => (
                  <CategoryRow
                    key={cat.id}
                    cat={cat}
                    allCategories={categories}
                    onEdit={handleOpenEdit}
                    onDelete={handleOpenDelete}
                    onToggleActive={handleToggleActive}
                    isTogglingId={isTogglingId}
                  />
                ))}
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* Create / Edit form dialog */}
      <CategoryForm
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        categories={categories}
        editValues={
          editTarget
            ? {
                id: editTarget.id,
                name: editTarget.name,
                description: editTarget.description ?? undefined,
                image: editTarget.image ?? undefined,
                parentId: editTarget.parentId,
                position: editTarget.position,
              }
            : undefined
        }
        onSubmit={formMode === "create" ? handleCreate : handleUpdate}
        isLoading={isCreating || isUpdating}
      />

      {/* Delete confirm dialog */}
      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title={`Delete "${deleteTarget?.name}"`}
        description="This action cannot be undone. Sub-categories will become root categories."
      />
    </div>
  );
}
