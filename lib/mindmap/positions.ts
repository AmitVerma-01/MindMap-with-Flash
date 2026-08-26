import type { MindMapTreeNode } from "@/types/mindmap";

export function hasSavedPositions(tree: MindMapTreeNode): boolean {
  if (tree.position) return true;
  for (const child of tree.children ?? []) {
    if (hasSavedPositions(child)) return true;
  }
  return false;
}

export function mergePositionsIntoTree(
  tree: MindMapTreeNode,
  positions: Record<string, { x: number; y: number }>
): MindMapTreeNode {
  function walk(node: MindMapTreeNode): MindMapTreeNode {
    const pos = positions[node.id];
    return {
      ...node,
      ...(pos ? { position: { x: pos.x, y: pos.y } } : {}),
      children: node.children?.map(walk),
    };
  }
  return walk(tree);
}
