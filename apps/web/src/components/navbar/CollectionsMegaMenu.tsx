import type { CategoryTreeNode } from "@/types/catalog";
import { CategoryColumn } from "./CategoryColumn";

type CollectionsMegaMenuProps = {
  categories: CategoryTreeNode[];
  open: boolean;
  /** Pixel offset from the top of the viewport — the live header height,
   * measured in Navbar via ResizeObserver, so the panel always sits
   * flush under the header regardless of scrolled/announcement-bar state. */
  topOffset: number;
};

/**
 * Kith.com-style full-bleed mega menu: fixed to the viewport (not the
 * trigger link), spans the full width, and drops to a full height
 * panel rather than the previous small floating card. Solid background
 * colour (no opacity modifier — that's what was letting the hero bleed
 * through) with its own internal scroll, so very long category lists
 * don't blow out past the viewport.
 *
 * Kept always-mounted and toggled with opacity/translate +
 * `pointer-events` instead of conditionally rendered, so the fade/slide
 * transition actually animates instead of popping in.
 */
export function CollectionsMegaMenu({ categories, open, topOffset }: CollectionsMegaMenuProps) {
  if (categories.length === 0) return null;

  return (
    <div
      style={{ top: topOffset, height: `calc(100vh - ${topOffset}px)` }}
      className={`fixed inset-x-0 z-40 transition-all duration-300 ease-luxury ${
        open
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      <div className="h-full bg-brand-cream border-t border-brand-stone/15 shadow-nav overflow-y-auto">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-x-10 gap-y-10">
          {categories.map((node) => (
            <CategoryColumn key={node.category.id} node={node} />
          ))}
        </div>
      </div>
    </div>
  );
}
