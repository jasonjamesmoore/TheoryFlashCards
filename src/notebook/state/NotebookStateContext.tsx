import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createInitialNotebookState } from '@/notebook/utils/starterData';
import type { NodeData, NodeType, PracticePage } from '@/notebook/utils/types';
import { getPageStorageKey } from '@/notebook/utils/storage';

interface NotebookStateContextValue {
  title: string;
  nodes: NodeData[];
  setTitle: (title: string) => void;
  addNode: (node: NodeData, index: number) => void;
  removeNodeByIndex: (nodeIndex: number) => void;
  updateNodeValue: (nodeIndex: number, value: string) => void;
  changeNodeType: (nodeIndex: number, type: NodeType) => void;
}

const NotebookStateContext = createContext<NotebookStateContextValue | null>(null);

const getTodayDateKey = () => new Date().toISOString().slice(0, 10);


function loadTodayNotebookState() {
  const today = getTodayDateKey();

  try {
    const raw = localStorage.getItem(getPageStorageKey(today));
    if (!raw) {
        return createInitialNotebookState();
    }

    const page = JSON.parse(raw) as PracticePage;

    return {
      title: page.title,
      nodes: page.nodes,
    };
  } catch {
    return createInitialNotebookState();
  }
}

export function NotebookStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(loadTodayNotebookState);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const today = getTodayDateKey();

      const page: PracticePage = {
        id: today,
        date: today,
        schemaVersion: 1,
        updatedAt: new Date().toISOString(),
        title: state.title,
        nodes: state.nodes,
      };

      localStorage.setItem(getPageStorageKey(today), JSON.stringify(page));
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [state]);

  const value = useMemo<NotebookStateContextValue>(() => {
    return {
      title: state.title,
      nodes: state.nodes,
      setTitle: (title: string) => {
        setState((prev) => ({ ...prev, title }));
      },
      addNode: (node: NodeData, index: number) => {
        setState((prev) => {
          const next = [...prev.nodes];
          const safeIndex = Math.max(0, Math.min(index, next.length));
          next.splice(safeIndex, 0, node);
          return { ...prev, nodes: next };
        });
      },
      removeNodeByIndex: (nodeIndex: number) => {
        setState((prev) => {
          if (nodeIndex < 0 || nodeIndex >= prev.nodes.length) {
            return prev;
          }

          const next = [...prev.nodes];
          next.splice(nodeIndex, 1);

          if (next.length === 0) {
            next.push({ id: crypto.randomUUID(), type: 'text', value: '' });
          }

          return { ...prev, nodes: next };
        });
      },
      updateNodeValue: (nodeIndex: number, value: string) => {
        setState((prev) => {
          if (nodeIndex < 0 || nodeIndex >= prev.nodes.length) {
            return prev;
          }

          const next = [...prev.nodes];
          next[nodeIndex] = { ...next[nodeIndex], value };
          return { ...prev, nodes: next };
        });
      },
      changeNodeType: (nodeIndex: number, type: NodeType) => {
        setState((prev) => {
          if (nodeIndex < 0 || nodeIndex >= prev.nodes.length) {
            return prev;
          }

          const next = [...prev.nodes];
          next[nodeIndex] = { ...next[nodeIndex], type, value: '' };
          return { ...prev, nodes: next };
        });
      },
    };
  }, [state]);

  return <NotebookStateContext.Provider value={value}>{children}</NotebookStateContext.Provider>;
}

export function useNotebookState() {
  const ctx = useContext(NotebookStateContext);

  if (!ctx) {
    throw new Error('useNotebookState must be used inside NotebookStateProvider');
  }

  return ctx;
}
