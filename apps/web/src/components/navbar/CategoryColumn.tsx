import type { CategoryTreeNode } from "@/types/catalog";

type CategoryColumnProps = {
  node: CategoryTreeNode;
  onNavigate?: () => void;
};

type CategorySubtreeProps = {
  nodes: CategoryTreeNode[];
  depth: number;
  onNavigate?: () => void;
};

/**
 * Renders one level of the tree and recurses into `children` for as
 * many levels as the data actually has (the real tree is 3 deep today —
 * e.g. Sunnah Clothing > Thobes Jubba > Saudi Thobes — but this makes
 * no assumption about depth, so a 4th level added later just works).
 * Styling gets one notch quieter (smaller text, indent guide) per
 * level so deep branches stay readable instead of all looking the same.
 */
function CategorySubtree({ nodes, depth, onNavigate }: CategorySubtreeProps) {
  if (nodes.length === 0) return null;

  const isFirstLevel = depth === 1;

  return (
    <ul className={isFirstLevel ? "mt-4 flex flex-col gap-2.5" : "mt-1.5 mb-1 flex flex-col gap-1.5"}>
      {nodes.map((node) => (
        <li key={node.category.id}>
          <a
            href={`/category/${node.category.slug}`}
            onClick={onNavigate}
            className={
              isFirstLevel
                ? "text-body-md text-brand-charcoal/65 hover:text-brand-gold transition-colors duration-300"
                : "text-caption text-brand-charcoal/45 hover:text-brand-gold transition-colors duration-300"
            }
          >
            {node.category.name}
          </a>
          <CategorySubtree
            nodes={node.children}
            depth={depth + 1}
            onNavigate={onNavigate}
          />
        </li>
      ))}
    </ul>
  );
}

/** One top-level category (the column header) + its full subtree. */
export function CategoryColumn({ node, onNavigate }: CategoryColumnProps) {
  return (
    <div className="min-w-[160px]">
      <a
        href={`/category/${node.category.slug}`}
        onClick={onNavigate}
        className="text-label uppercase tracking-widest text-brand-charcoal/90 hover:text-brand-gold transition-colors duration-300"
      >
        {node.category.name}
      </a>

      <CategorySubtree nodes={node.children} depth={1} onNavigate={onNavigate} />
    </div>
  );
}
