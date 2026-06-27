"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  useGetProductsQuery,
  useToggleProductActiveMutation,
  type ProductListItem,
  type Product,
} from "@/redux/api/productApi";
import { ProductFormModal } from "@/components/products/ProductFormModal";
import { DeleteProductDialog } from "@/components/products/DeleteProductDialog";
import type { ProductQueryInput } from "@our-sunnah/validation";

type StockBadge = "instock" | "lowstock" | "outofstock";

function stockStatus(stock: number): StockBadge {
  if (stock === 0) return "outofstock";
  if (stock <= 5) return "lowstock";
  return "instock";
}

const STOCK_LABEL: Record<StockBadge, string> = {
  instock: "In Stock",
  lowstock: "Low Stock",
  outofstock: "Out of Stock",
};

export default function ProductsPage() {
  const [filters, setFilters] = useState<Partial<ProductQueryInput>>({
    page: 1,
    limit: 20,
    sort: "newest",
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const { data, isLoading, isFetching } = useGetProductsQuery(filters);
  const [toggleActive] = useToggleProductActiveMutation();

  const products = data?.data ?? [];
  const meta = data?.meta;

  const openCreate = () => {
    setEditTarget(undefined);
    setFormOpen(true);
  };

  const openEdit = (p: ProductListItem) => {
    setEditTarget(p as unknown as Product);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditTarget(undefined);
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      <Sidebar />
      <div className="ml-60">
        <Header title="Products" subtitle="Manage Catalog Inventory and Visibility" />

        <main className="p-6 space-y-5">
          {/* Filter Row */}
          <div className="flex items-center gap-3 flex-wrap">
            <Select
              value={filters.sort ?? "newest"}
              onValueChange={(v) =>
                setFilters((prev: Partial<ProductQueryInput>) => ({
                  ...prev,
                  sort: v as ProductQueryInput["sort"],
                  page: 1,
                }))
              }
            >
              <SelectTrigger className="w-44 h-9">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            <Select
              onValueChange={(v) =>
                setFilters((prev: Partial<ProductQueryInput>) => ({
                  ...prev,
                  isFeatured: v === "featured" ? true : undefined,
                  page: 1,
                }))
              }
            >
              <SelectTrigger className="w-44 h-9">
                <SelectValue placeholder="All Products" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="featured">Featured Only</SelectItem>
              </SelectContent>
            </Select>

            <div className="ml-auto">
              <Button variant="gold" size="md" onClick={openCreate}>
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </div>
          </div>

          {/* Table */}
          <Card>
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardTitle>Catalog Overview</CardTitle>
                <span className="text-xs uppercase tracking-widest text-brand-stone font-sans">
                  {isLoading ? "Loading..." : `${meta?.total ?? 0} Products`}
                </span>
              </div>
            </CardHeader>

            <CardContent className="p-0 mt-3">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-5">Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="text-right">Active</TableHead>
                    <TableHead className="text-right pr-5">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {isLoading || isFetching ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-12 text-center text-sm text-brand-stone font-sans">
                        Loading products...
                      </TableCell>
                    </TableRow>
                  ) : products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-12 text-center text-sm text-brand-stone font-sans">
                        No products found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((p) => {
                      const status = stockStatus(p.stock);
                      const thumb = p.images[0]?.url;
                      const category = p.categories[0]?.name ?? "-";

                      return (
                        <TableRow key={p.id}>
                          <TableCell className="pl-5">
                            <div className="flex items-center gap-3">
                              <div className="h-11 w-11 rounded-md bg-brand-beige-dark shrink-0 overflow-hidden">
                                {thumb && (
                                  <img
                                    src={thumb}
                                    alt={p.name}
                                    className="h-full w-full object-cover"
                                  />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium font-sans text-brand-charcoal">
                                  {p.name}
                                </p>
                                <p className="text-xs uppercase tracking-widest text-brand-stone font-sans">
                                  {p.brand ?? "-"}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="text-xs uppercase tracking-widest text-brand-stone font-sans">
                            {category}
                          </TableCell>

                          <TableCell>
                            <span className="text-brand-gold font-medium font-sans">
                              ${parseFloat(p.price).toFixed(2)}
                            </span>
                            {p.compareAtPrice && (
                              <span className="ml-1.5 text-xs text-brand-stone font-sans line-through">
                                ${parseFloat(p.compareAtPrice).toFixed(2)}
                              </span>
                            )}
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <Badge variant={status}>{STOCK_LABEL[status]}</Badge>
                              <span className="text-xs text-brand-stone font-sans">
                                ({p.stock})
                              </span>
                            </div>
                          </TableCell>

                          <TableCell>
                            {p.isFeatured ? (
                              <Badge variant="active">Featured</Badge>
                            ) : (
                              <span className="text-xs text-brand-stone font-sans">-</span>
                            )}
                          </TableCell>

                          <TableCell className="text-right">
                            <Switch
                              checked={p.isActive}
                              onCheckedChange={(checked) =>
                                toggleActive({ id: p.id, isActive: checked })
                              }
                            />
                          </TableCell>

                          <TableCell className="text-right pr-5">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEdit(p)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() =>
                                  setDeleteTarget({ id: p.id, name: p.name })
                                }
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>

              {meta && meta.totalPage > 1 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-brand-beige-dark">
                  <span className="text-xs text-brand-stone font-sans">
                    Page {meta.page} of {meta.totalPage}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={meta.page <= 1}
                      onClick={() =>
                        setFilters((prev: Partial<ProductQueryInput>) => ({ ...prev, page: (meta.page ?? 1) - 1 }))
                      }
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={meta.page >= meta.totalPage}
                      onClick={() =>
                        setFilters((prev: Partial<ProductQueryInput>) => ({ ...prev, page: (meta.page ?? 1) + 1 }))
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      <ProductFormModal open={formOpen} onClose={closeForm} product={editTarget} />
      <DeleteProductDialog
        productId={deleteTarget?.id ?? null}
        productName={deleteTarget?.name ?? ""}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
