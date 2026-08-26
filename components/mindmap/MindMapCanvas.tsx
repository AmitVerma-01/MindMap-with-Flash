"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  type NodeMouseHandler,
  type Node,
  type OnNodeDrag,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { treeToFlowElements } from "@/lib/mindmap/layout";
import { mergePositionsIntoTree } from "@/lib/mindmap/positions";
import { ApiError, patchJson } from "@/lib/api/fetch-json";
import type { MindMapTreeNode } from "@/types/mindmap";

const SAVE_DEBOUNCE_MS = 1000;

interface MindMapCanvasProps {
  mindMapId: string;
  tree: MindMapTreeNode;
  onNodeSelect?: (node: MindMapTreeNode) => void;
  onSaveError?: (message: string) => void;
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

function nodesToPositionMap(nodes: Node[]): Record<string, { x: number; y: number }> {
  return Object.fromEntries(
    nodes.map((node) => [node.id, { x: node.position.x, y: node.position.y }])
  );
}

function MindMapCanvasInner({
  mindMapId,
  tree,
  onNodeSelect,
  onSaveError,
}: MindMapCanvasProps) {
  const treeRef = useRef(tree);
  treeRef.current = tree;

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => treeToFlowElements(tree),
    [tree]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { fitView } = useReactFlow();
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasFittedRef = useRef(false);

  useEffect(() => {
    const { nodes: n, edges: e } = treeToFlowElements(tree);
    setNodes(n);
    setEdges(e);
    hasFittedRef.current = false;
  }, [mindMapId, tree, setNodes, setEdges]);

  useEffect(() => {
    if (hasFittedRef.current || nodes.length === 0) return;
    const frame = requestAnimationFrame(() => {
      fitView({ padding: 0.2, duration: 200 });
      hasFittedRef.current = true;
    });
    return () => cancelAnimationFrame(frame);
  }, [nodes.length, fitView]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const persistPositions = useCallback(
    async (currentNodes: Node[]) => {
      const positions = nodesToPositionMap(currentNodes);
      const updatedTree = mergePositionsIntoTree(treeRef.current, positions);

      try {
        await patchJson(`/api/mindmap-sets/${mindMapId}`, { tree: updatedTree });
        treeRef.current = updatedTree;
      } catch (error) {
        onSaveError?.(
          error instanceof ApiError
            ? error.message
            : "Failed to save node positions"
        );
      }
    },
    [mindMapId, onSaveError]
  );

  const scheduleSave = useCallback(
    (currentNodes: Node[]) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        void persistPositions(currentNodes);
      }, SAVE_DEBOUNCE_MS);
    },
    [persistPositions]
  );

  const handleNodeDrag: OnNodeDrag = useCallback(
    (_event, _node, draggedNodes) => {
      scheduleSave(draggedNodes);
    },
    [scheduleSave]
  );

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_event, node: Node) => {
      if (!onNodeSelect) return;
      const found = findNodeById(treeRef.current, node.id);
      if (found) onNodeSelect(found);
    },
    [onNodeSelect]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={handleNodeClick}
      onNodeDrag={handleNodeDrag}
      onNodeDragStop={handleNodeDrag}
      minZoom={0.1}
      maxZoom={2}
      proOptions={{ hideAttribution: true }}
      nodesDraggable
      nodesConnectable={false}
      elementsSelectable
      zoomOnScroll
      panOnScroll
    >
      <Background color="rgba(255,255,255,0.08)" gap={20} />
      <Controls showInteractive={false} position="bottom-left" />
      <MiniMap
        nodeColor={() => "rgba(232, 132, 26, 0.6)"}
        maskColor="rgba(0,0,0,0.6)"
        className="mindmap-minimap"
        pannable
        zoomable
      />
    </ReactFlow>
  );
}

export default function MindMapCanvas(props: MindMapCanvasProps) {
  return (
    <div className="mindmap-canvas w-full h-[60vh] min-h-[400px] rounded-2xl overflow-hidden border border-border bg-background/50">
      <ReactFlowProvider>
        <MindMapCanvasInner {...props} />
      </ReactFlowProvider>
    </div>
  );
}
