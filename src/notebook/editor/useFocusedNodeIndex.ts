import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { NodeData } from '@/notebook/utils/types';

export function useFocusedNodeIndex(nodes: NodeData[]): [number, Dispatch<SetStateAction<number>>] {
  const [focusedNodeIndex, setFocusedNodeIndex] = useState(0);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        setFocusedNodeIndex((index) => Math.max(index - 1, 0));
      }
      if (event.key === 'ArrowDown') {
        setFocusedNodeIndex((index) => Math.min(index + 1, Math.max(nodes.length - 1, 0)));
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [nodes.length]);

  return [focusedNodeIndex, setFocusedNodeIndex];
}
