export interface MindMapNodePosition {
  x: number;
  y: number;
}

export interface MindMapTreeNode {
  id: string;
  label: string;
  position?: MindMapNodePosition;
  children?: MindMapTreeNode[];
}

export interface MindMapSetData {
  id: string;
  title: string;
  topic: string;
  tree: MindMapTreeNode;
  flashcardSetId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MindMapGenerationRequest {
  topic: string;
  extra?: string;
  title?: string;
}

export interface MindMapFromSetRequest {
  flashcardSetId: string;
  title?: string;
}

export const MINDMAP_CREDIT_COST = 3;
