import type { CategoryTreeNode } from "@/types/catalog";
import { CategoryColumn } from "./CategoryColumn";

type CollectionsMegaMenuProps = {
  categories: CategoryTreeNode[];
  open: boolean;
};

/**
 * Absolutely positioned under the navbar, inside the same relative
 * wrapper as the "Collections" trigger link (see Navbar.tsx) so hover
 * can span both without a gap. Kept always-mounted and toggled with
 * opacity/translate + `pointer-events` rather than conditionally
 * rendered, so the fade/slide transition actually animates instead of
 * popping in.
 */
export function CollectionsMegaMenu({ categories, open }: CollectionsMegaMenuProps) {
  if (categories.length === 0) return null;

  return (
    <div
      className={`absolute left-1/2 top-full -translate-x-1/2 pt-4 transition-all duration-300 ease-luxury ${
        open
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      <div className="bg-brand-cream/98 backdrop-blur-md shadow-card-hover border border-brand-stone/10 rounded-sm px-10 py-8 max-w-[min(90vw,1200px)] max-h-[75vh] overflow-y-auto">
        <div className="flex flex-wrap gap-x-12 gap-y-8">
          {categories.map((node) => (
            <CategoryColumn key={node.category.id} node={node} />
          ))}
        </div>
      </div>
    </div>
  );
}
