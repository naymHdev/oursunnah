"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";

const products = [
  { id: 1, name: "Sunnah Oud Perfume", sub: "Premium Fragrance", category: "Fragrance", price: "$48.00", stock: "instock", active: false },
  { id: 2, name: "Quran Study Journal", sub: "Stationery", category: "Books", price: "$22.00", stock: "lowstock", active: true },
  { id: 3, name: "Prayer Mat Collection", sub: "Home Essentials", category: "Home", price: "$36.00", stock: "instock", active: true },
  { id: 4, name: "Ajwa Dates Gift Box", sub: "Gourmet", category: "Food", price: "$29.00", stock: "outofstock", active: false },
  { id: 5, name: "Natural Miswak Brush", sub: "Oral Care", category: "Wellness", price: "$12.00", stock: "instock", active: true },
  { id: 6, name: "Amber Scented Candle", sub: "Home Fragrance", category: "Decor", price: "$18.00", stock: "lowstock", active: false },
  { id: 7, name: "Ramadan Gift Box", sub: "Seasonal Set", category: "Gifts", price: "$64.00", stock: "instock", active: true },
];

type StockKey = "instock" | "lowstock" | "outofstock";

const stockLabel: Record<StockKey, string> = {
  instock: "In Stock",
  lowstock: "Low Stock",
  outofstock: "Out of Stock",
};

export default function ProductsPage() {
  const [items, setItems] = useState(products);

  const toggleActive = (id: number) => {
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      <Sidebar />
      <div className="ml-60">
        <Header title="Products" subtitle="Manage Catalog Inventory and Visibility" />
        <main className="p-6">
          {/* Filters Row */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <Select>
              <SelectTrigger className="w-44 h-9">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="fragrance">Fragrance</SelectItem>
                <SelectItem value="books">Books</SelectItem>
                <SelectItem value="home">Home</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="wellness">Wellness</SelectItem>
                <SelectItem value="gifts">Gifts</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-44 h-9">
                <SelectValue placeholder="Stock Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="instock">In Stock</SelectItem>
                <SelectItem value="lowstock">Low Stock</SelectItem>
                <SelectItem value="outofstock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            <div className="ml-auto">
              <Button variant="gold" size="md">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </div>
          </div>

          {/* Table */}
          <Card>
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardTitle className="font-serif text-xl">Catalog Overview</CardTitle>
                <span className="text-xs uppercase tracking-widest text-brand-stone font-sans">
                  {items.length} Products
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
                    <TableHead className="text-right pr-5">Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="pl-5">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-md bg-brand-beige-dark shrink-0" />
                          <div>
                            <p className="text-sm font-medium font-sans">{product.name}</p>
                            <p className="text-xs uppercase tracking-widest text-brand-stone font-sans">
                              {product.sub}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs uppercase tracking-widest text-brand-stone font-sans">
                        {product.category}
                      </TableCell>
                      <TableCell className="text-brand-gold font-medium">{product.price}</TableCell>
                      <TableCell>
                        <Badge variant={product.stock as StockKey}>
                          {stockLabel[product.stock as StockKey]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-5">
                        <Switch
                          checked={product.active}
                          onCheckedChange={() => toggleActive(product.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
