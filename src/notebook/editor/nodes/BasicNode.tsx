import { useEffect, useRef } from 'react';
import type { FormEventHandler, KeyboardEventHandler } from 'react';
import { nanoid } from 'nanoid';
import classNames from 'classnames';
import { CommandPanel } from '@/notebook/editor/command-menu/CommandPanel';
import { useNotebookState } from '@/notebook/state/NotebookStateContext';
import type { NodeData, NodeType } from '@/notebook/utils/types';
import styles from './BasicNode.module.css';

interface BasicNodeProps {
  node: NodeData;
  updateFocusedIndex: (index: number) => void;
  isFocused: boolean;
  index: number;
}

export function BasicNode({ node, updateFocusedIndex, isFocused, index }: BasicNodeProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const showCommandPanel = isFocused && Boolean(node.value.match(/^\//));

  const { updateNodeValue, changeNodeType, removeNodeByIndex, addNode } = useNotebookState();

  useEffect(() => {
    if (!nodeRef.current) {
      return;
    }

    if (document.activeElement !== nodeRef.current) {
      nodeRef.current.textContent = node.value;
    }

    if (isFocused) {
      nodeRef.current.focus();
    } else {
      nodeRef.current.blur();
    }
  }, [node.value, isFocused]);

  const parseCommand = (nodeType: NodeType) => {
    changeNodeType(index, nodeType);
    if (nodeRef.current) {
      nodeRef.current.textContent = '';
    }
  };

  const handleInput: FormEventHandler<HTMLDivElement> = ({ currentTarget }) => {
    updateNodeValue(index, currentTarget.textContent || '');
  };

  const handleClick = () => {
    updateFocusedIndex(index);
  };

  const onKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    const target = event.target as HTMLDivElement;

    if (event.key === 'Enter') {
      event.preventDefault();

      if (target.textContent?.[0] === '/') {
        return;
      }

      addNode({ type: node.type, value: '', id: nanoid() }, index + 1);
      updateFocusedIndex(index + 1);
    }

    if (event.key === 'Backspace' && (target.textContent || '').length === 0) {
      event.preventDefault();
      removeNodeByIndex(index);
      updateFocusedIndex(Math.max(index - 1, 0));
    }
  };

  return (
    <div className={styles.nodeShell}>
      {showCommandPanel ? <CommandPanel selectItem={parseCommand} nodeText={node.value} /> : null}
      <div
        onInput={handleInput}
        onClick={handleClick}
        onKeyDown={onKeyDown}
        ref={nodeRef}
        contentEditable
        suppressContentEditableWarning
        className={classNames(styles.node, styles[node.type])}
      />
    </div>
  );
}
