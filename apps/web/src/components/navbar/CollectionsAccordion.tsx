import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { CategoryTreeNode } from "@/types/catalog";
import { CategoryColumn } from "./CategoryColumn";

type CollectionsAccordionProps = {
  categories: CategoryTreeNode[];
  onNavigate: () => void;
};

/**
 * Hover doesn't exist on touch devices, so the mobile drawer gets a
 * tap-to-expand accordion instead of the desktop mega-menu. Reuses
 * `CategoryColumn` for the actual link rendering so both surfaces stay
 * in sync automatically.
 */
export function CollectionsAccordion({ categories, onNavigate }: CollectionsAccordionProps) {
  const [expanded, setExpanded] = useState(false);

  if (categories.length === 0) return null;

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full flex items-center justify-between font-serif text-3xl text-brand-charcoal hover:text-brand-gold transition-colors duration-300"
      >
        Collections
        <ChevronDown
          size={20}
          strokeWidth={1.5}
          className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`grid transition-all duration-500 ease-luxury ${
          expanded ? "grid-rows-[1fr] opacity-100 mt-5" : "grid-rows-[0fr] opacity-0"
        }`}
        style={{ display: "grid" }}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-6 pl-1">
            {categories.map((node) => (
              <CategoryColumn key={node.category.id} node={node} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
