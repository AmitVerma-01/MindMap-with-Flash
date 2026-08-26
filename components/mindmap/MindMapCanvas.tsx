"use client";

import { useCallback, useEffect, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type NodeMouseHandler,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { treeToFlowElements } from "@/lib/mindmap/layout";
import type { MindMapTreeNode } from "@/types/mindmap";

interface MindMapCanvasProps {
  tree: MindMapTreeNode;
  onNodeSelect?: (node: MindMapTreeNode) => void;
}

function findNodeById(
  node: MindMapTreeNode,
  id: string
): MindMapTreeNode | null {
  if (node.id === id) return node;
  for (const child of node.children ?? []) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
}

export default function MindMapCanvas({ tree, onNodeSelect }: MindMapCanvasProps) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => treeToFlowElements(tree),
    [tree]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    const { nodes: n, edges: e } = treeToFlowElements(tree);
    setNodes(n);
    setEdges(e);
  }, [tree, setNodes, setEdges]);

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_event, node: Node) => {
      if (!onNodeSelect) return;
      const found = findNodeById(tree, node.id);
      if (found) onNodeSelect(found);
    },
    [onNodeSelect, tree]
  );

  return (
    <div className="w-full h-[60vh] min-h-[400px] rounded-2xl overflow-hidden border border-border bg-background/50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
      >
        <Background color="rgba(255,255,255,0.08)" gap={20} />
        <Controls className="!bg-surface !border-border" />
        <MiniMap
          nodeColor={() => "rgba(232, 132, 26, 0.6)"}
          maskColor="rgba(0,0,0,0.6)"
          className="!bg-surface !border-border"
        />
      </ReactFlow>
    </div>
  );
}
