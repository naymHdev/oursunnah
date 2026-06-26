"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { GripVertical, Pencil, Trash2, Plus, ChevronRight, ChevronDown } from "lucide-react";

type Category = {
  id: number;
  name: string;
  count: number;
  active: boolean;
  children?: Category[];
};

const initialCategories: Category[] = [
  {
    id: 1, name: "Fragrances", count: 45, active: true,
    children: [
      { id: 4, name: "Attar Oils", count: 12, active: true },
      { id: 5, name: "Incense", count: 8, active: true },
      { id: 6, name: "Perfumes", count: 25, active: true },
    ],
  },
  {
    id: 2, name: "Clothing", count: 120, active: true,
    children: [
      { id: 7, name: "Abayas", count: 50, active: true },
      { id: 8, name: "Thobes", count: 40, active: true },
      { id: 9, name: "Hijabs", count: 30, active: true },
    ],
  },
  {
    id: 3, name: "Wellness", count: 30, active: false,
    children: [
      { id: 10, name: "Prayer Mats", count: 15, active: true },
      { id: 11, name: "Tasbih", count: 10, active: true },
      { id: 12, name: "Essential Oils", count: 5, active: true },
    ],
  },
];

function CategoryRow({
  cat,
  depth = 0,
  onToggle,
}: {
  cat: Category;
  depth?: number;
  onToggle: (id: number) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = cat.children && cat.children.length > 0;

  return (
    <>
      <div
        className={`flex items-center gap-3 px-4 py-3 border-b border-brand-beige-dark/60 hover:bg-brand-cream/60 transition-colors group ${depth > 0 ? "pl-10 bg-brand-cream/30" : ""}`}
      >
        {/* Drag handle */}
        <GripVertical className="h-4 w-4 text-brand-stone/40 cursor-grab shrink-0" />

        {/* Expand toggle */}
        {hasChildren ? (
          <button onClick={() => setExpanded(!expanded)} className="text-brand-stone hover:text-brand-charcoal">
            {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </button>
        ) : (
          <span className="w-3.5" />
        )}

        {/* Name */}
        <span className={`flex-1 font-sans text-sm ${depth === 0 ? "font-medium text-brand-charcoal" : "text-brand-charcoal/80"}`}>
          {cat.name}
        </span>

        {/* Count badge */}
        <span className="text-xs font-sans text-brand-stone bg-brand-beige-dark/60 rounded-full px-2 py-0.5 min-w-[28px] text-center">
          {cat.count}
        </span>

        {/* Toggle */}
        <Switch checked={cat.active} onCheckedChange={() => onToggle(cat.id)} />

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-brand-cream transition-colors text-brand-stone hover:text-brand-charcoal">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-red-50 transition-colors text-brand-stone hover:text-red-500">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && expanded &&
        cat.children!.map((child) => (
          <CategoryRow key={child.id} cat={child} depth={depth + 1} onToggle={onToggle} />
        ))
      }
    </>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);

  const toggleActive = (id: number) => {
    const toggle = (cats: Category[]): Category[] =>
      cats.map((c) => ({
        ...c,
        active: c.id === id ? !c.active : c.active,
        children: c.children ? toggle(c.children) : undefined,
      }));
    setCategories(toggle(categories));
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      <Sidebar />
      <div className="ml-60">
        <Header title="Categories" subtitle="Manage Product Hierarchy" />
        <main className="p-6">
          <div className="flex justify-end mb-5">
            <Button variant="gold">
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </div>

          <Card>
            <div className="px-4 py-2.5 border-b border-brand-beige-dark">
              <p className="text-xs uppercase tracking-widest text-brand-stone font-sans flex items-center gap-1.5">
                <GripVertical className="h-3.5 w-3.5" />
                Drag to reorder
              </p>
            </div>
            <CardContent className="p-0">
              {categories.map((cat) => (
                <CategoryRow key={cat.id} cat={cat} onToggle={toggleActive} />
              ))}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
