import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { listSavedPages, loadNotebookPage, saveNotebookPage } from '@/notebook/utils/storage';
import type { NodeData, NodeType, PracticePage } from '@/notebook/utils/types';

interface NotebookStateContextValue {
  title: string;
  nodes: NodeData[];
  activeDate: string;
  openPage: (date: string) => void;
  savedPages: PracticePage[];
  setTitle: (title: string) => void;
  addNode: (node: NodeData, index: number) => void;
  removeNodeByIndex: (nodeIndex: number) => void;
  updateNodeValue: (nodeIndex: number, value: string) => void;
  changeNodeType: (nodeIndex: number, type: NodeType) => void;
}

const NotebookStateContext = createContext<NotebookStateContextValue | null>(null);
const getTodayDateKey = () => new Date().toISOString().slice(0, 10);

export function NotebookStateProvider({ children }: { children: React.ReactNode }) {
  const initialDateRef = useRef<string>(getTodayDateKey());
  const [state, setState] = useState(() => loadNotebookPage(initialDateRef.current));
  const [activeDate, setActiveDate] = useState<string>(() => initialDateRef.current);
  const [savedPages, setSavedPages] = useState<PracticePage[]>(() => listSavedPages());

  useEffect(() => {
    setSavedPages((previousPages) => {
        const updatedPage: PracticePage = {
            id: activeDate,
          date: activeDate,
          schemaVersion: 1,
          updatedAt: new Date().toISOString(),
          title: state.title,
          nodes: state.nodes,
        };
        const existingIndex = previousPages.findIndex((page) => page.date === activeDate);

        const nextPages =
            existingIndex !== -1
                ? previousPages.map((page, index) => (index === existingIndex ? updatedPage : page))
                : [...previousPages, updatedPage];

        return nextPages.sort((a, b) => b.date.localeCompare(a.date));
    });

    const timeout = window.setTimeout(() => {
      saveNotebookPage(activeDate, state);
    }, 500);

    return () => window.clearTimeout(timeout);
  }, [state, activeDate]);

  const value = useMemo<NotebookStateContextValue>(() => {
    return {
      activeDate,
      savedPages,
      openPage: (date: string) => {
        setActiveDate(date);
        setState(loadNotebookPage(date));
      },
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
  }, [state, activeDate]);

  return <NotebookStateContext.Provider value={value}>{children}</NotebookStateContext.Provider>;
}

export function useNotebookState() {
  const ctx = useContext(NotebookStateContext);

  if (!ctx) {
    throw new Error('useNotebookState must be used inside NotebookStateProvider');
  }

  return ctx;
}
