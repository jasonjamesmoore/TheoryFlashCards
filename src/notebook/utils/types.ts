export type NodeType = 'text' | 'list' | 'heading' | 'timer';

export interface NodeData {
  id: string;
  type: NodeType;
  value: string;
}

export interface NotebookState {
  title: string;
  nodes: NodeData[];
}

export interface PracticePage {
  id: string; // YYYY-MM-DD for local version.
  date: string; // YYYY-MM-DD
  schemaVersion: 1;
  updatedAt: string;
  title: string;
  nodes: NodeData[];
}

type PrincipleKey = string;
type ActivityLabel = string;

export type ActivityOptionsByPrinciple = Record<PrincipleKey, ActivityLabel[]>;
