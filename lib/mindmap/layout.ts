import type { MindMapTreeNode } from "@/types/mindmap";
import type { Edge, Node } from "@xyflow/react";

const HORIZONTAL_SPACING = 220;
const VERTICAL_SPACING = 100;

export function treeToFlowElements(tree: MindMapTreeNode): {
  nodes: Node[];
  edges: Edge[];
} {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  function walk(
    node: MindMapTreeNode,
    depth: number,
    indexInLevel: number,
    siblingsCount: number,
    parentId?: string
  ) {
    const x =
      (indexInLevel - (siblingsCount - 1) / 2) * HORIZONTAL_SPACING;
    const y = depth * VERTICAL_SPACING;

    nodes.push({
      id: node.id,
      position: { x, y },
      data: { label: node.label },
      type: "default",
      style: {
        background: depth === 0 ? "rgba(232, 132, 26, 0.25)" : "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "12px",
        padding: "10px 14px",
        color: "#f8fafc",
        fontSize: depth === 0 ? "14px" : "12px",
        fontWeight: depth === 0 ? 700 : 500,
        minWidth: "120px",
        textAlign: "center",
      },
    });

    if (parentId) {
      edges.push({
        id: `${parentId}-${node.id}`,
        source: parentId,
        target: node.id,
        style: { stroke: "rgba(232, 132, 26, 0.5)" },
        animated: false,
      });
    }

    const children = node.children ?? [];
    children.forEach((child, i) => {
      walk(child, depth + 1, i, children.length, node.id);
    });
  }

  walk(tree, 0, 0, 1);
  return { nodes, edges };
}

export function countNodes(node: MindMapTreeNode): number {
  let count = 1;
  for (const child of node.children ?? []) {
    count += countNodes(child);
  }
  return count;
}
