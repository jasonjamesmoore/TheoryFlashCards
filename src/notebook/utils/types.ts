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
