"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { CategoryTreeNode } from "@/types/catalog";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

function findCategoryPath(
  nodes: CategoryTreeNode[],
  slug: string,
): CategoryTreeNode[] | null {
  for (const node of nodes) {
    if (node.category.slug === slug) return [node];
    const childPath = findCategoryPath(node.children, slug);
    if (childPath) return [node, ...childPath];
  }
  return null;
}

function buildExpandedSet(nodes: CategoryTreeNode[], slug: string) {
  const path = findCategoryPath(nodes, slug);
  const expanded = new Set<string>();

  if (!path) return expanded;

  path.slice(0, -1).forEach((node) => expanded.add(node.category.slug));
  const selected = path[path.length - 1];
  if (selected?.children.length) expanded.add(selected.category.slug);

  return expanded;
}

function CategoryTree({
  nodes,
  depth,
  selectedSlug,
  expandedSlugs,
  onToggleExpand,
  onSelect,
}: {
  nodes: CategoryTreeNode[];
  depth: number;
  selectedSlug: string;
  expandedSlugs: Set<string>;
  onToggleExpand: (slug: string) => void;
  onSelect: (slug: string) => void;
}) {
  if (nodes.length === 0) return null;

  return (
    <ul
      className={
        depth === 0
          ? "space-y-1"
          : "mt-1 space-y-1 border-l border-brand-charcoal/10 pl-3"
      }
    >
      {nodes.map((node) => {
        const hasChildren = node.children.length > 0;
        const isExpanded = expandedSlugs.has(node.category.slug);
        const isSelected = selectedSlug === node.category.slug;

        return (
          <li key={node.category.id}>
            <div className="flex items-center gap-2">
              <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="category"
                  checked={isSelected}
                  onChange={() => onSelect(node.category.slug)}
                  className="peer sr-only"
                />
                <span className="flex h-4 w-4 shrink-0 items-center justify-center border border-brand-charcoal/35 bg-transparent transition-colors duration-300 peer-checked:border-brand-charcoal peer-checked:bg-brand-charcoal">
                  <span className="h-1.5 w-1.5 scale-0 bg-brand-cream transition-transform duration-300 peer-checked:scale-100" />
                </span>
                <span
                  className={`min-w-0 flex-1 truncate text-[10px] leading-none uppercase tracking-[0.18em] transition-colors duration-300 ${
                    isSelected
                      ? "text-brand-charcoal"
                      : "text-brand-charcoal/75"
                  }`}
                >
                  {node.category.name}
                </span>
              </label>

              {hasChildren && (
                <button
                  type="button"
                  onClick={() => onToggleExpand(node.category.slug)}
                  aria-label={`${isExpanded ? "Collapse" : "Expand"} ${node.category.name}`}
                  aria-expanded={isExpanded}
                  className="flex h-4 w-4 shrink-0 items-center justify-center text-brand-charcoal/45 transition-colors duration-300 hover:text-brand-charcoal"
                >
                  <ChevronRight
                    size={12}
                    strokeWidth={1.5}
                    className={`transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`}
                  />
                </button>
              )}
            </div>

            {hasChildren && isExpanded && (
              <CategoryTree
                nodes={node.children}
                depth={depth + 1}
                selectedSlug={selectedSlug}
                expandedSlugs={expandedSlugs}
                onToggleExpand={onToggleExpand}
                onSelect={onSelect}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Kith-style "Filter & Sort" slide-over. Note: the backend's
 * `getProducts` query currently accepts a single `categorySlug`, not an
 * array — so unlike Kith's multi-select checkboxes, category here is a
 * single active filter (radio-like toggle). Extending to true multi-category
 * would need a backend change (`categorySlug: string[]` + `in` query).
 */
export default function FilterDrawer({
  categories,
  activeCategorySlug,
}: {
  categories: CategoryTreeNode[];
  /** Pre-set when rendered on a `/category/[slug]` page — locks that filter visually. */
  activeCategorySlug?: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [sort, setSort] = useState(searchParams.get("sort") ?? "newest");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [hideSoldOut, setHideSoldOut] = useState(
    searchParams.get("hideSoldOut") === "1",
  );
  const [category, setCategory] = useState(
    activeCategorySlug ?? searchParams.get("category") ?? "",
  );
  const [expandedSlugs, setExpandedSlugs] = useState<Set<string>>(new Set());

  // Keep local state in sync if the URL changes externally (e.g. back/forward nav)
  useEffect(() => {
    setSort(searchParams.get("sort") ?? "newest");
    setMinPrice(searchParams.get("minPrice") ?? "");
    setMaxPrice(searchParams.get("maxPrice") ?? "");
    setHideSoldOut(searchParams.get("hideSoldOut") === "1");
    setCategory(activeCategorySlug ?? searchParams.get("category") ?? "");
  }, [searchParams, activeCategorySlug]);

  useEffect(() => {
    if (!open) return;
    setExpandedSlugs(buildExpandedSet(categories, category));
  }, [categories, category, open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDrawer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const apply = () => {
    const params = new URLSearchParams();
    if (sort !== "newest") params.set("sort", sort);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (hideSoldOut) params.set("hideSoldOut", "1");

    if (activeCategorySlug !== undefined) {
      const target = category ? `/category/${category}` : "/products";
      router.push(`${target}?${params.toString()}`);
    } else {
      if (category) params.set("category", category);
      router.push(`${pathname}?${params.toString()}`);
    }
    setOpen(false);
  };

  const reset = () => {
    setSort("newest");
    setMinPrice("");
    setMaxPrice("");
    setHideSoldOut(false);
    setCategory(activeCategorySlug ?? "");
    setExpandedSlugs(new Set());
    router.push(
      activeCategorySlug ? `/category/${activeCategorySlug}` : pathname,
    );
    setOpen(false);
  };

  const toggleExpand = (slug: string) => {
    setExpandedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const closeDrawer = () => setOpen(false);

  // Portal needs the DOM to be ready — isMounted guards SSR.
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-10 items-center gap-1.5 whitespace-nowrap border border-brand-charcoal/15 px-3 text-[10px] leading-none uppercase tracking-[0.18em] text-brand-charcoal/80 transition-colors duration-300 hover:text-brand-gold"
      >
        <SlidersHorizontal size={13} strokeWidth={1.5} />
        Filter
      </button>

      {open && isMounted && createPortal(
        <div className="fixed inset-0 z-[70] flex justify-end">
          <div
            className="absolute inset-0 bg-brand-charcoal/40"
            onClick={closeDrawer}
          />

          <div className="relative h-full w-full max-w-sm overflow-y-auto bg-brand-cream shadow-xl animate-in slide-in-from-right duration-300">
            <div className="sticky top-0 z-[71] flex items-center justify-between border-b border-brand-charcoal/10 bg-brand-cream p-6">
              <h2 className="font-serif text-xl text-brand-charcoal">
                Filter &amp; Sort
              </h2>
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  closeDrawer();
                }}
                aria-label="Close"
                className="relative z-20 -mr-2 flex h-10 w-10 items-center justify-center pointer-events-auto text-brand-charcoal/60 transition-colors duration-300 hover:text-brand-charcoal"
              >
                <X
                  size={20}
                  className="pointer-events-none text-brand-charcoal/60"
                />
              </button>
            </div>

            <div className="space-y-8 p-6">
              <fieldset>
                <legend className="mb-3 text-label uppercase tracking-widest text-brand-charcoal/90">
                  Sort By
                </legend>
                <div className="space-y-2.5">
                  {SORT_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="sort"
                        value={opt.value}
                        checked={sort === opt.value}
                        onChange={() => setSort(opt.value)}
                        className="sr-only peer"
                      />
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center border border-brand-charcoal/35 bg-transparent transition-colors duration-300 peer-checked:border-brand-charcoal peer-checked:bg-brand-charcoal">
                        <span className="h-1.5 w-1.5 scale-0 bg-brand-cream transition-transform duration-300 peer-checked:scale-100" />
                      </span>
                      <span className="text-body-md text-brand-charcoal/80">
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-3 text-label uppercase tracking-widest text-brand-charcoal/90">
                  Category
                </legend>

                <div className="max-h-80 space-y-1 overflow-y-auto pr-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={category === ""}
                      onChange={() => setCategory("")}
                      className="sr-only peer"
                    />
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center border border-brand-charcoal/35 bg-transparent transition-colors duration-300 peer-checked:border-brand-charcoal peer-checked:bg-brand-charcoal">
                      <span className="h-1.5 w-1.5 scale-0 bg-brand-cream transition-transform duration-300 peer-checked:scale-100" />
                    </span>
                    <span className="text-body-md text-brand-charcoal/80">
                      All Categories
                    </span>
                  </label>

                  <CategoryTree
                    nodes={categories}
                    depth={0}
                    selectedSlug={category}
                    expandedSlugs={expandedSlugs}
                    onToggleExpand={toggleExpand}
                    onSelect={setCategory}
                  />
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-3 text-label uppercase tracking-widest text-brand-charcoal/90">
                  Price
                </legend>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={0}
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full border border-brand-charcoal/20 bg-transparent px-3 py-2 text-body-md text-brand-charcoal focus:border-brand-charcoal/50 focus:outline-none"
                  />
                  <span className="text-brand-charcoal/40">—</span>
                  <input
                    type="number"
                    min={0}
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full border border-brand-charcoal/20 bg-transparent px-3 py-2 text-body-md text-brand-charcoal focus:border-brand-charcoal/50 focus:outline-none"
                  />
                </div>
              </fieldset>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hideSoldOut}
                  onChange={(e) => setHideSoldOut(e.target.checked)}
                  className="sr-only peer"
                />
                <span className="flex h-4 w-4 shrink-0 items-center justify-center border border-brand-charcoal/35 bg-transparent transition-colors duration-300 peer-checked:border-brand-charcoal peer-checked:bg-brand-charcoal">
                  <span className="h-1.5 w-1.5 scale-0 bg-brand-cream transition-transform duration-300 peer-checked:scale-100" />
                </span>
                <span className="text-body-md text-brand-charcoal/80">
                  Hide Sold Out Products
                </span>
              </label>
            </div>

            <div className="sticky bottom-0 flex gap-3 border-t border-brand-charcoal/10 bg-brand-cream p-6">
              <button
                onClick={reset}
                className="flex-1 border border-brand-charcoal/20 py-3 text-label uppercase tracking-widest text-brand-charcoal/70 transition-colors duration-300 hover:border-brand-charcoal/50"
              >
                Reset
              </button>
              <button
                onClick={apply}
                className="flex-1 bg-brand-charcoal py-3 text-label uppercase tracking-widest text-brand-cream transition-colors duration-300 hover:bg-brand-emerald"
              >
                Apply
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
