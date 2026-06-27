import { useState } from "react";
import type { CategoryTreeNode } from "@/types/catalog";
import { CategoryImage } from "./CategoryImage";
import { DrawerSubtree } from "./DrawerSubtree";

type CollectionsMegaMenuProps = {
  categories: CategoryTreeNode[];
  open: boolean;
  /** Pixel offset from the top of the viewport — the live header height,
   * measured in Navbar via ResizeObserver, so the drawer always sits
   * flush under the header regardless of scrolled/announcement-bar state. */
  topOffset: number;
};

/**
 * Kith.com-style left-side drawer: a narrow column of top-level
 * categories on the left, and whichever one is hovered/active expands
 * a second pane to its right showing that category's subtree. Full
 * height under the header, solid background, slides in from the left
 * edge rather than dropping down full-width.
 *
 * Category images are entirely optional — `category.image` is
 * nullable on the model, so most rows today render as plain text.
 * `CategoryImage` itself returns null when there's no URL, so there's
 * never an empty placeholder box; this only "lights up" once images
 * are added to the category data later.
 *
 * Kept always-mounted and toggled with opacity/translate +
 * `pointer-events` instead of conditionally rendered, so the slide-in
 * transition actually animates instead of popping in.
 */
export function CollectionsMegaMenu({ categories, open, topOffset }: CollectionsMegaMenuProps) {
  const [activeId, setActiveId] = useState<string | null>(categories[0]?.category.id ?? null);

  if (categories.length === 0) return null;

  const active = categories.find((node) => node.category.id === activeId) ?? categories[0];
  const hasSubcategories = active.children.length > 0;

  return (
    <div
      style={{ top: topOffset, height: `calc(100vh - ${topOffset}px)` }}
      className={`fixed left-0 z-40 transition-all duration-300 ease-luxury ${
        open
          ? "opacity-100 translate-x-0 pointer-events-auto"
          : "opacity-0 -translate-x-2 pointer-events-none"
      }`}
    >
      <div className="h-full flex bg-brand-cream border-r border-t border-brand-stone/15 shadow-nav">
        {/* Pane 1 — top-level categories */}
        <nav className="w-[260px] shrink-0 overflow-y-auto py-8 px-6 border-r border-brand-stone/10">
          <ul className="flex flex-col gap-0.5">
            {categories.map((node) => {
              const isActive = node.category.id === active.category.id;
              return (
                <li key={node.category.id}>
                  <a
                    href={`/category/${node.category.slug}`}
                    onMouseEnter={() => setActiveId(node.category.id)}
                    className={`flex items-center gap-3 py-2.5 px-2 -mx-2 rounded-sm text-label uppercase tracking-widest transition-colors duration-200 ${
                      isActive
                        ? "bg-brand-beige text-brand-charcoal"
                        : "text-brand-charcoal/65 hover:text-brand-charcoal hover:bg-brand-beige/50"
                    }`}
                  >
                    <CategoryImage src={node.category.image} alt={node.category.name} size={32} />
                    {node.category.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Pane 2 — active category's subtree */}
        {hasSubcategories && (
          <div className="w-[320px] shrink-0 overflow-y-auto py-8 px-7">
            <p className="text-label uppercase tracking-widest text-brand-gold mb-5">
              {active.category.name}
            </p>
            <DrawerSubtree nodes={active.children} depth={1} />
          </div>
        )}
      </div>
    </div>
  );
}
