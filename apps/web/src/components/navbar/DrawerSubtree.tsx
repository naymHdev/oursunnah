import type { CategoryTreeNode } from "@/types/catalog";
import { CategoryImage } from "./CategoryImage";

type DrawerSubtreeProps = {
  nodes: CategoryTreeNode[];
  depth: number;
  onNavigate?: () => void;
};

/**
 * Renders the children of whichever top-level category is active in
 * the drawer's left pane. No depth limit assumed — recurses for as
 * many levels as the data actually has.
 */
export function DrawerSubtree({ nodes, depth, onNavigate }: DrawerSubtreeProps) {
  if (nodes.length === 0) return null;

  const isFirstLevel = depth === 1;

  return (
    <ul className={isFirstLevel ? "flex flex-col gap-1" : "mt-1 mb-1.5 ml-3 flex flex-col gap-1 border-l border-brand-stone/15 pl-3"}>
      {nodes.map((node) => (
        <li key={node.category.id}>
          <a
            href={`/category/${node.category.slug}`}
            onClick={onNavigate}
            className={
              isFirstLevel
                ? "flex items-center gap-2.5 py-1.5 text-body-md text-brand-charcoal/70 hover:text-brand-gold transition-colors duration-300"
                : "flex items-center gap-2 py-1 text-caption text-brand-charcoal/50 hover:text-brand-gold transition-colors duration-300"
            }
          >
            <CategoryImage
              src={node.category.image}
              alt={node.category.name}
              size={isFirstLevel ? 28 : 20}
            />
            {node.category.name}
          </a>
          <DrawerSubtree nodes={node.children} depth={depth + 1} onNavigate={onNavigate} />
        </li>
      ))}
    </ul>
  );
}
