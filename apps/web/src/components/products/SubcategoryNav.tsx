import Link from 'next/link';
import type { CategoryTreeNode } from '@/types/catalog';

/** Finds the tree node matching `slug` anywhere in the tree (DFS). */
export function findCategoryNode(
  nodes: CategoryTreeNode[],
  slug: string
): CategoryTreeNode | null {
  for (const node of nodes) {
    if (node.category.slug === slug) return node;
    const found = findCategoryNode(node.children, slug);
    if (found) return found;
  }
  return null;
}

/**
 * Returns the path of nodes from the ROOT ancestor down to the node
 * matching `slug` (inclusive), or `null` if not found. Used so the
 * subcategory nav always shows the root's children — even when the
 * current page is a deep leaf category with no children of its own —
 * instead of disappearing.
 */
export function findRootChain(
  nodes: CategoryTreeNode[],
  slug: string
): CategoryTreeNode[] | null {
  for (const root of nodes) {
    const path = findPath(root, slug);
    if (path) return path;
  }
  return null;
}

function findPath(node: CategoryTreeNode, slug: string): CategoryTreeNode[] | null {
  if (node.category.slug === slug) return [node];
  for (const child of node.children) {
    const rest = findPath(child, slug);
    if (rest) return [node, ...rest];
  }
  return null;
}

/**
 * Kith-style subcategory chip row — e.g. on `/category/kith-women`, this
 * renders "Outerwear · Hoodies · Tees · Pants · ..." as a horizontally
 * scrollable pill nav directly under the category title, one level below
 * the current category in the tree. Hidden entirely if the category has
 * no children.
 */
export default function SubcategoryNav({
  children,
  activeSlug,
}: {
  children: CategoryTreeNode[];
  activeSlug: string;
}) {
  if (children.length === 0) return null;

  return (
    <nav
      className="flex max-w-full gap-1.5 overflow-x-auto overflow-y-hidden scrollbar-none"
      aria-label="Subcategories"
    >
      {children.map((node) => {
        const isActive = node.category.slug === activeSlug;
        return (
          <Link
            key={node.category.id}
            href={`/category/${node.category.slug}`}
            className={`inline-flex h-10 shrink-0 items-center whitespace-nowrap px-3 text-[10px] leading-none uppercase tracking-[0.18em] border transition-colors duration-300 ${
              isActive
                ? 'bg-brand-charcoal text-brand-cream border-brand-charcoal'
                : 'text-brand-charcoal/70 border-brand-charcoal/15 hover:border-brand-charcoal/50'
            }`}
          >
            {node.category.name}
          </Link>
        );
      })}
    </nav>
  );
}
