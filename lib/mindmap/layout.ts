import type { MindMapTreeNode } from "@/types/mindmap";
import type { Edge, Node } from "@xyflow/react";
import { hasSavedPositions } from "@/lib/mindmap/positions";

const HORIZONTAL_SPACING = 200;
const VERTICAL_SPACING = 120;

function computeAutoPositions(
  tree: MindMapTreeNode
): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();
  let nextX = 0;

  function layout(node: MindMapTreeNode, depth: number): number {
    const children = node.children ?? [];
    const y = depth * VERTICAL_SPACING;

    if (children.length === 0) {
      const x = nextX;
      nextX += HORIZONTAL_SPACING;
      positions.set(node.id, { x, y });
      return x;
    }

    const childXs: number[] = [];
    for (const child of children) {
      childXs.push(layout(child, depth + 1));
    }

    const x = (childXs[0] + childXs[childXs.length - 1]) / 2;
    positions.set(node.id, { x, y });
    return x;
  }

  layout(tree, 0);

  const xs = [...positions.values()].map((p) => p.x);
  if (xs.length > 0) {
    const center = (Math.min(...xs) + Math.max(...xs)) / 2;
    for (const [id, pos] of positions) {
      positions.set(id, { x: pos.x - center, y: pos.y });
    }
  }

  return positions;
}

function collectSavedPositions(
  node: MindMapTreeNode,
  positions: Map<string, { x: number; y: number }>
): void {
  if (node.position) {
    positions.set(node.id, { ...node.position });
  }
  for (const child of node.children ?? []) {
    collectSavedPositions(child, positions);
  }
}

function resolvePositions(
  tree: MindMapTreeNode
): Map<string, { x: number; y: number }> {
  if (hasSavedPositions(tree)) {
    const positions = new Map<string, { x: number; y: number }>();
    collectSavedPositions(tree, positions);
    const auto = computeAutoPositions(tree);
    for (const [id, pos] of auto) {
      if (!positions.has(id)) {
        positions.set(id, pos);
      }
    }
    return positions;
  }
  return computeAutoPositions(tree);
}

export function treeToFlowElements(tree: MindMapTreeNode): {
  nodes: Node[];
  edges: Edge[];
} {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const positions = resolvePositions(tree);

  function walk(node: MindMapTreeNode, depth: number, parentId?: string) {
    const pos = positions.get(node.id) ?? { x: 0, y: depth * VERTICAL_SPACING };

    nodes.push({
      id: node.id,
      position: pos,
      data: { label: node.label },
      type: "default",
      style: {
        background:
          depth === 0
            ? "rgba(232, 132, 26, 0.25)"
            : "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "12px",
        padding: "10px 14px",
        color: "#f8fafc",
        fontSize: depth === 0 ? "14px" : "12px",
        fontWeight: depth === 0 ? 700 : 500,
        minWidth: "120px",
        maxWidth: "220px",
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

    for (const child of node.children ?? []) {
      walk(child, depth + 1, node.id);
    }
  }

  walk(tree, 0);
  return { nodes, edges };
}

export function countNodes(node: MindMapTreeNode): number {
  let count = 1;
  for (const child of node.children ?? []) {
    count += countNodes(child);
  }
  return count;
}
