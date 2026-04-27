import { nanoid } from 'nanoid';
import type { NotebookState } from './types';

export function createInitialNotebookState(): NotebookState {
  return {
    title: 'Notebook',
    nodes: [{ id: nanoid(), type: 'text', value: '' }],
  };
}
