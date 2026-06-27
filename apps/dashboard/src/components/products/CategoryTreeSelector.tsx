import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import type { TCategoryTree } from "@/redux/api/categoryApi";

interface CategoryTreeSelectorProps {
  categories: TCategoryTree[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  error?: string;
}

interface CategoryNodeProps {
  category: TCategoryTree;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  level: number;
}

function CategoryNode({ category, selectedIds, onChange, level }: CategoryNodeProps) {
  const hasChildren = category.children && category.children.length > 0;
  // Auto-expand root and first level
  const [isExpanded, setIsExpanded] = useState(level < 1);
  const isSelected = selectedIds.includes(category.id);

  const handleToggle = () => {
    if (isSelected) {
      onChange(selectedIds.filter((id) => id !== category.id));
    } else {
      onChange([...selectedIds, category.id]);
    }
  };

  return (
    <div>
      <div
        className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-brand-cream/50 transition-colors"
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {/* Expand toggle */}
        <button
          type="button"
          onClick={() => setIsExpanded((s) => !s)}
          className="w-5 h-5 flex items-center justify-center shrink-0 text-brand-stone hover:text-brand-charcoal transition-colors"
        >
          {hasChildren ? (
            isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          ) : (
            <span className="w-3 h-px bg-brand-beige-dark block" />
          )}
        </button>

        {/* Checkbox */}
        <input
          type="checkbox"
          id={`cat-${category.id}`}
          checked={isSelected}
          onChange={handleToggle}
          className="h-4 w-4 rounded border-brand-beige-dark text-brand-gold focus:ring-brand-gold cursor-pointer shrink-0"
        />

        {/* Label */}
        <label
          htmlFor={`cat-${category.id}`}
          className="flex-1 text-sm font-sans text-brand-charcoal cursor-pointer select-none leading-tight"
        >
          {category.name}
        </label>

        {/* Child count badge */}
        {hasChildren && (
          <span className="text-[10px] bg-brand-cream text-brand-stone border border-brand-beige-dark px-1.5 py-0.5 rounded font-sans shrink-0">
            {category.children.length}
          </span>
        )}
      </div>

      {/* Recursive children */}
      {hasChildren && isExpanded && (
        <div className="border-l border-brand-beige-dark/40 ml-4">
          {category.children.map((child) => (
            <CategoryNode
              key={child.id}
              category={child}
              selectedIds={selectedIds}
              onChange={onChange}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Flatten tree to find category by id
function findInTree(categories: TCategoryTree[], id: string): TCategoryTree | null {
  for (const cat of categories) {
    if (cat.id === id) return cat;
    if (cat.children?.length) {
      const found = findInTree(cat.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function CategoryTreeSelector({
  categories,
  selectedIds,
  onChange,
  error,
}: CategoryTreeSelectorProps) {
  // Build selected category name chips
  const selectedCategories = useMemo(
    () =>
      selectedIds
        .map((id) => findInTree(categories, id))
        .filter((c): c is TCategoryTree => c !== null),
    [selectedIds, categories]
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Selected chips */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-2.5 rounded-lg bg-brand-gold/5 border border-brand-gold/20">
          {selectedCategories.map((cat) => (
            <span
              key={cat.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-gold text-brand-cream text-xs font-sans font-medium"
            >
              {cat.name}
              <button
                type="button"
                onClick={() => onChange(selectedIds.filter((id) => id !== cat.id))}
                className="hover:opacity-70 transition-opacity"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Tree */}
      <div className="border border-brand-beige-dark rounded-lg max-h-72 overflow-y-auto bg-white p-1">
        {categories.length === 0 ? (
          <p className="text-sm text-brand-stone font-sans p-4 text-center">
            Loading categories…
          </p>
        ) : (
          categories.map((cat) => (
            <CategoryNode
              key={cat.id}
              category={cat}
              selectedIds={selectedIds}
              onChange={onChange}
              level={0}
            />
          ))
        )}
      </div>

      {selectedIds.length === 0 && error && (
        <p className="text-xs text-red-500 font-sans">{error}</p>
      )}
    </div>
  );
}
