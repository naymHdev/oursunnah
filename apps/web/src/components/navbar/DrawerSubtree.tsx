"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { CategoryTreeNode } from "@/types/catalog";
import { CategoryImage } from "./CategoryImage";

type DrawerSubtreeProps = {
  nodes: CategoryTreeNode[];
  depth: number;
  onNavigate?: () => void;
};

type DrawerSubtreeItemProps = {
  node: CategoryTreeNode;
  isFirstLevel: boolean;
  depth: number;
  onNavigate?: () => void;
};

/**
 * One row + its own collapse state. Every node with children starts
 * collapsed — nothing auto-expands at any depth — and only opens when
 * its chevron is clicked. The category name stays a plain link so
 * clicking it still navigates; the chevron is the only thing that
 * toggles the nested list.
 */
function DrawerSubtreeItem({ node, isFirstLevel, depth, onNavigate }: DrawerSubtreeItemProps) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = node.children.length > 0;

  return (
    <li>
      <div
        className={
          isFirstLevel
            ? "flex items-center gap-1.5 py-1.5 text-body-md text-brand-charcoal/70"
            : "flex items-center gap-1.5 py-1 text-caption text-brand-charcoal/50"
        }
      >
        <a
          href={`/category/${node.category.slug}`}
          onClick={onNavigate}
          className="flex items-center gap-2.5 flex-1 min-w-0 hover:text-brand-gold transition-colors duration-300"
        >
          <CategoryImage
            src={node.category.image}
            alt={node.category.name}
            size={isFirstLevel ? 28 : 20}
          />
          <span className="truncate">{node.category.name}</span>
        </a>
        {hasChildren && (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            aria-label={`${node.category.name} sub-categories`}
            className="shrink-0 p-1 -m-1 text-brand-charcoal/40 hover:text-brand-gold transition-colors duration-300"
          >
            <ChevronRight
              size={isFirstLevel ? 14 : 12}
              strokeWidth={1.5}
              className={`transition-transform duration-300 ${expanded ? "rotate-90" : ""}`}
            />
          </button>
        )}
      </div>

      {hasChildren && expanded && (
        <DrawerSubtree nodes={node.children} depth={depth + 1} onNavigate={onNavigate} />
      )}
    </li>
  );
}

/**
 * Renders the children of whichever top-level category is active in
 * the drawer's left pane. No depth limit assumed — recurses for as
 * many levels as the data actually has — but every level is collapsed
 * by default; nothing auto-expands.
 */
export function DrawerSubtree({ nodes, depth, onNavigate }: DrawerSubtreeProps) {
  if (nodes.length === 0) return null;

  const isFirstLevel = depth === 1;

  return (
    <ul className={isFirstLevel ? "flex flex-col gap-1" : "mt-1 mb-1.5 ml-3 flex flex-col gap-1 border-l border-brand-stone/15 pl-3"}>
      {nodes.map((node) => (
        <DrawerSubtreeItem
          key={node.category.id}
          node={node}
          isFirstLevel={isFirstLevel}
          depth={depth}
          onNavigate={onNavigate}
        />
      ))}
    </ul>
  );
}
