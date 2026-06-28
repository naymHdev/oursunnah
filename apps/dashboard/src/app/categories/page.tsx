"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

type CategoryStats = {
  roots: number;
  total: number;
  active: number;
};

type CategoryNodeProps = {
  cat: TCategoryTree;
  depth?: number;
  path: string[];
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  onEdit: (cat: TCategoryTree) => void;
  onDelete: (cat: TCategoryTree) => void;
  onToggleActive: (cat: TCategoryTree) => void;
  isTogglingId: string | null;
};

function getCategoryStats(categories: TCategoryTree[]): CategoryStats {
  const stats: CategoryStats = { roots: categories.length, total: 0, active: 0 };

  const walk = (items: TCategoryTree[]) => {
    for (const item of items) {
      stats.total += 1;
      if (item.isActive) stats.active += 1;
      if (item.children.length > 0) walk(item.children);
    }
  };

  walk(categories);
  return stats;
}

function collectCategoryIds(categories: TCategoryTree[]): string[] {
  const ids: string[] = [];

  const walk = (items: TCategoryTree[]) => {
    for (const item of items) {
      ids.push(item.id);
      if (item.children.length > 0) walk(item.children);
    }
  };

  walk(categories);
  return ids;
}

function CategoryNode({
  cat,
  depth = 0,
  path,
  expandedIds,
  onToggleExpand,
  onEdit,
  onDelete,
  onToggleActive,
  isTogglingId,
}: CategoryNodeProps) {
  const hasChildren = cat.children.length > 0;
  const isExpanded = expandedIds.has(cat.id);
  const isToggling = isTogglingId === cat.id;
  const currentPath = [...path, cat.name];

  return (
    <div className={depth > 0 ? "pl-5 border-l border-dashed border-brand-beige-dark/70" : ""}>
      <div
        className={[
          "rounded-xl border border-brand-beige-dark bg-white/90 shadow-sm overflow-hidden",
          depth === 0 ? "bg-brand-cream-warm" : "",
        ].join(" ")}
      >
        <div className="flex items-start gap-3 px-4 py-4 group">
          <button
            type="button"
            onClick={() => hasChildren && onToggleExpand(cat.id)}
            disabled={!hasChildren}
            className={[
              "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition-colors",
              hasChildren
                ? "border-brand-beige-dark bg-white text-brand-stone hover:border-brand-gold hover:text-brand-charcoal"
                : "border-dashed border-brand-beige-dark/70 bg-brand-cream text-brand-stone/30 cursor-default",
            ].join(" ")}
            title={hasChildren ? (isExpanded ? "Collapse subtree" : "Expand subtree") : "Leaf category"}
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )
            ) : (
              <span className="h-2 w-2 rounded-full bg-brand-beige-dark/60" />
            )}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="min-w-0 truncate font-serif text-base text-brand-charcoal">
                {cat.name}
              </h3>
              <Badge variant={cat.isActive ? "active" : "inactive"}>
                {cat.isActive ? "Active" : "Inactive"}
              </Badge>
              <Badge variant="default">Level {depth + 1}</Badge>
              {hasChildren && <Badge variant="default">{cat.children.length} children</Badge>}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-sans text-brand-stone">
              <span className="rounded-full bg-brand-cream px-2.5 py-1">
                Path: {currentPath.join(" / ")}
              </span>
              <span className="rounded-full bg-brand-cream px-2.5 py-1">
                /{cat.slug}
              </span>
              <span className="rounded-full bg-brand-cream px-2.5 py-1">
                Position {cat.position}
              </span>
              {cat._count?.products !== undefined && (
                <span className="rounded-full bg-brand-cream px-2.5 py-1">
                  {cat._count.products} products
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isToggling ? (
              <Loader2 className="h-4 w-4 animate-spin text-brand-stone" />
            ) : (
              <Switch
                checked={cat.isActive}
                onCheckedChange={() => onToggleActive(cat)}
              />
            )}

            <button
              onClick={() => onEdit(cat)}
              className="h-8 w-8 flex items-center justify-center rounded-md border border-brand-beige-dark bg-white text-brand-stone transition-colors hover:text-brand-charcoal hover:border-brand-gold"
              title="Edit"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onDelete(cat)}
              className="h-8 w-8 flex items-center justify-center rounded-md border border-brand-beige-dark bg-white text-brand-stone transition-colors hover:text-red-500 hover:border-red-200"
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="mt-3 space-y-3">
          {cat.children.map((child) => (
            <CategoryNode
              key={child.id}
              cat={child}
              depth={depth + 1}
              path={currentPath}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleActive={onToggleActive}
              isTogglingId={isTogglingId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  const { data, isLoading, isError } = useGetCategoryTreeQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editTarget, setEditTarget] = useState<TCategoryTree | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TCategoryTree | null>(null);
  const [isTogglingId, setIsTogglingId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const categories = data ?? [];
  const stats = getCategoryStats(categories);

  useEffect(() => {
    if (categories.length > 0 && expandedIds.size === 0) {
      setExpandedIds(new Set(categories.map((cat) => cat.id)));
    }
  }, [categories, expandedIds.size]);

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

  const handleCreate = async (payload: CreateCategoryInput) => {
    await createCategory(payload).unwrap();
    setFormOpen(false);
  };

  const handleUpdate = async (payload: CreateCategoryInput) => {
    if (!editTarget) return;
    await updateCategory({
      id: editTarget.id,
      body: payload as UpdateCategoryInput,
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

  const toggleExpanded = (id: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => setExpandedIds(new Set(collectCategoryIds(categories)));
  const collapseAll = () => setExpandedIds(new Set());

  return (
    <div className="min-h-screen bg-brand-cream">
      <Sidebar />
      <div className="ml-60">
        <Header title="Categories" subtitle="Manage Product Hierarchy" />
        <main className="p-6">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-brand-beige-dark bg-white px-4 py-3 shadow-sm">
                <p className="text-[10px] uppercase tracking-[0.25em] text-brand-stone font-sans">
                  Root groups
                </p>
                <p className="mt-1 font-serif text-2xl text-brand-charcoal">
                  {stats.roots}
                </p>
              </div>
              <div className="rounded-xl border border-brand-beige-dark bg-white px-4 py-3 shadow-sm">
                <p className="text-[10px] uppercase tracking-[0.25em] text-brand-stone font-sans">
                  Total categories
                </p>
                <p className="mt-1 font-serif text-2xl text-brand-charcoal">
                  {stats.total}
                </p>
              </div>
              <div className="rounded-xl border border-brand-beige-dark bg-white px-4 py-3 shadow-sm">
                <p className="text-[10px] uppercase tracking-[0.25em] text-brand-stone font-sans">
                  Active categories
                </p>
                <p className="mt-1 font-serif text-2xl text-brand-charcoal">
                  {stats.active}
                </p>
              </div>
            </div>

            <Button variant="gold" onClick={handleOpenCreate}>
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-brand-gold" />
            </div>
          )}

          {isError && (
            <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <p className="text-sm font-sans text-red-600">
                Failed to load categories. Please refresh the page.
              </p>
            </div>
          )}

          {!isLoading && !isError && categories.length === 0 && (
            <div className="rounded-xl border border-dashed border-brand-beige-dark py-20 text-center">
              <p className="mb-1 font-serif text-xl text-brand-charcoal">
                No categories yet
              </p>
              <p className="mb-5 text-sm font-sans text-brand-stone">
                Create your first category to organise products
              </p>
              <Button variant="gold" onClick={handleOpenCreate}>
                <Plus className="h-4 w-4" />
                Add Category
              </Button>
            </div>
          )}

          {!isLoading && !isError && categories.length > 0 && (
            <Card className="overflow-hidden">
              <div className="flex flex-col gap-3 border-b border-brand-beige-dark px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-3.5 w-3.5 text-brand-stone" />
                  <p className="text-xs uppercase tracking-[0.25em] text-brand-stone font-sans">
                    Category tree
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" onClick={collapseAll}>
                    Collapse all
                  </Button>
                  <Button variant="outline" onClick={expandAll}>
                    Expand all
                  </Button>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-brand-stone font-sans">
                    Nested categories stay readable by full path
                  </p>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-4">
                  {categories.map((cat) => (
                    <CategoryNode
                      key={cat.id}
                      cat={cat}
                      path={[]}
                      expandedIds={expandedIds}
                      onToggleExpand={toggleExpanded}
                      onEdit={handleOpenEdit}
                      onDelete={handleOpenDelete}
                      onToggleActive={handleToggleActive}
                      isTogglingId={isTogglingId}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

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
                isFeatured: editTarget.isFeatured,
              }
            : undefined
        }
        onSubmit={formMode === "create" ? handleCreate : handleUpdate}
        isLoading={isCreating || isUpdating}
      />

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
