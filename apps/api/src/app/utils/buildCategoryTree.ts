interface FlatCategory {
  id: string;
  parentId: string | null;
  [key: string]: unknown;
}

export interface CategoryTreeNode<T extends FlatCategory> {
  category: T;
  children: CategoryTreeNode<T>[];
}

/**
 * Builds a nested tree from a flat list of categories in a single pass
 * (O(n)), instead of querying parent/children recursively per node.
 */
export const buildCategoryTree = <T extends FlatCategory>(
  categories: T[]
): CategoryTreeNode<T>[] => {
  const nodeById = new Map<string, CategoryTreeNode<T>>();
  const roots: CategoryTreeNode<T>[] = [];

  for (const category of categories) {
    nodeById.set(category.id, { category, children: [] });
  }

  for (const category of categories) {
    const node = nodeById.get(category.id)!;

    if (category.parentId) {
      const parentNode = nodeById.get(category.parentId);
      if (parentNode) {
        parentNode.children.push(node);
        continue;
      }
    }

    roots.push(node);
  }

  return roots;
};
