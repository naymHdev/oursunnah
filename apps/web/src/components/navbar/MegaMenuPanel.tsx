"use client";

import { useState } from "react";
import type { CategoryTreeNode } from "@/types/catalog";
import { CategoryImage } from "./CategoryImage";

type MegaMenuPanelProps = {
  categories: CategoryTreeNode[];
  open: boolean;
  /** Pixel offset from the top of the viewport — the live header
   * height, measured in Navbar via ResizeObserver, so the panel
   * always sits flush under the header regardless of scrolled /
   * announcement-bar state. */
  topOffset: number;
};

/**
 * Full-width editorial mega menu ("Option C").
 *
 * Replaces the old hover-flyout two-pane drawer. Instead of revealing
 * depth through hover-and-guess, all three category levels for the
 * active root are visible at once:
 *
 *   Level 1 — a row of tabs across the top (the roots)
 *   Level 2 — columns beneath the active tab
 *   Level 3 — a short list under each column
 *
 * Switching which root is active still happens on hover (fast
 * browsing, no extra click), but nothing below that is hidden behind
 * hover/expand — the full subtree of whichever root is active is
 * always fully rendered. This is deliberately calmer and more
 * "boutique" than a flyout: the customer sees the whole shape of the
 * catalog at a glance instead of discovering it by accident.
 *
 * Visual language stays restrained — a single rotated-square
 * ("geometric diamond") motif marks the active tab and closes the
 * panel, echoing Islamic geometric ornament without becoming
 * decorative clutter. No drop shadows beyond the existing `shadow-nav`
 * token, no gradients, no icon set — just type, gold hairlines, and
 * whitespace.
 */
export function MegaMenuPanel({ categories, open, topOffset }: MegaMenuPanelProps) {
  const [activeId, setActiveId] = useState<string | null>(categories[0]?.category.id ?? null);

  if (categories.length === 0) return null;

  const active = categories.find((node) => node.category.id === activeId) ?? categories[0];
  const columns = active.children;

  return (
    <div
      style={{ top: topOffset }}
      className={`fixed left-0 right-0 z-40 transition-all duration-300 ease-luxury ${
        open
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      <div className="bg-brand-cream border-t border-b border-brand-stone/15 shadow-nav">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

          {/* Level 1 — root tabs */}
          <nav
            className="flex items-center gap-9 border-b border-brand-stone/10 py-4 overflow-x-auto scrollbar-none"
            aria-label="Category groups"
          >
            {categories.map((node) => {
              const isActive = node.category.id === active.category.id;
              return (
                <a
                  key={node.category.id}
                  href={`/category/${node.category.slug}`}
                  onMouseEnter={() => setActiveId(node.category.id)}
                  className={`relative flex items-center gap-2.5 pb-2 text-label uppercase tracking-widest whitespace-nowrap transition-colors duration-300 ${
                    isActive
                      ? "text-brand-charcoal"
                      : "text-brand-charcoal/55 hover:text-brand-charcoal"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`w-1.5 h-1.5 border border-brand-gold rotate-45 shrink-0 transition-opacity duration-300 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {node.category.name}
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-[1px] left-0 h-px bg-brand-gold transition-all duration-300 ${
                      isActive ? "w-full" : "w-0"
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* Level 2 + 3 — full subtree of the active root, all visible at once */}
          <div className="py-9">
            {columns.length === 0 ? (
              <a
                href={`/category/${active.category.slug}`}
                className="text-body-md text-brand-charcoal/60 hover:text-brand-gold transition-colors duration-300"
              >
                Shop all {active.category.name}
              </a>
            ) : (
              <div
                className="grid gap-x-10 gap-y-8"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(columns.length, 5)}, minmax(0, 1fr))`,
                }}
              >
                {columns.map((column) => (
                  <div key={column.category.id} className="min-w-0">
                    <a
                      href={`/category/${column.category.slug}`}
                      className="flex items-center gap-2.5 mb-4 group"
                    >
                      <CategoryImage
                        src={column.category.image}
                        alt={column.category.name}
                        size={28}
                      />
                      <span className="text-label uppercase tracking-widest text-brand-charcoal/85 group-hover:text-brand-gold transition-colors duration-300">
                        {column.category.name}
                      </span>
                    </a>
                    <div className="w-6 h-px bg-brand-gold/40 mb-3" />
                    {column.children.length > 0 && (
                      <ul className="flex flex-col gap-2">
                        {column.children.map((grandchild) => (
                          <li key={grandchild.category.id}>
                            <a
                              href={`/category/${grandchild.category.slug}`}
                              className="text-caption text-brand-charcoal/55 hover:text-brand-gold transition-colors duration-300"
                            >
                              {grandchild.category.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quiet closing ornament — not a CTA, just a calm full stop */}
          <div className="flex items-center justify-center gap-3 pb-6" aria-hidden="true">
            <span className="w-10 h-px bg-brand-gold/30" />
            <span className="w-2 h-2 border border-brand-gold/50 rotate-45" />
            <span className="w-10 h-px bg-brand-gold/30" />
          </div>
        </div>
      </div>
    </div>
  );
}
