import type { CategoryTreeNode } from "@/types/catalog";

type CategoryColumnProps = {
  node: CategoryTreeNode;
  onNavigate?: () => void;
};

/**
 * One top-level category + its children, rendered as a single column.
 * Used as-is inside the desktop mega-menu grid, and re-used (with
 * slightly different surrounding markup) inside the mobile accordion —
 * keeping the actual link list in one place so the two surfaces can't
 * drift out of sync.
 */
export function CategoryColumn({ node, onNavigate }: CategoryColumnProps) {
  return (
    <div className="min-w-[160px]">
      <a
        href={`/category/${node.category.slug}`}
        onClick={onNavigate}
        className="font-serif text-lg text-brand-charcoal hover:text-brand-gold transition-colors duration-300"
      >
        {node.category.name}
      </a>

      {node.children.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2.5">
          {node.children.map((child) => (
            <li key={child.category.id}>
              <a
                href={`/category/${child.category.slug}`}
                onClick={onNavigate}
                className="text-body-md text-brand-charcoal/65 hover:text-brand-gold transition-colors duration-300"
              >
                {child.category.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
