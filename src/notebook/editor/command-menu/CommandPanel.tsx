import { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useOverflowsScreenBottom } from './useOverflowsScreenBottom';
import type { NodeType } from '@/notebook/utils/types';
import styles from './CommandPanel.module.css';

interface CommandPanelProps {
  nodeText: string;
  selectItem: (nodeType: NodeType) => void;
}

interface SupportedNodeType {
  value: NodeType;
  name: string;
}

const supportedNodeTypes: SupportedNodeType[] = [
  { value: 'text', name: 'Text' },
  { value: 'list', name: 'List' },
  { value: 'heading', name: 'Heading' },
  { value: 'timer', name: 'Timer' },
];

export function CommandPanel({ selectItem, nodeText }: CommandPanelProps) {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const { overflows, ref } = useOverflowsScreenBottom();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        selectItem(supportedNodeTypes[selectedItemIndex].value);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItemIndex, selectItem]);

  const normalizedValue = useMemo(() => nodeText.toLowerCase().replace('/', ''), [nodeText]);

  useEffect(() => {
    const foundIndex = supportedNodeTypes.findIndex((item) => item.value.match(normalizedValue));
    setSelectedItemIndex(foundIndex >= 0 ? foundIndex : 0);
  }, [normalizedValue]);

  return (
    <div ref={ref} className={classNames(styles.panel, { [styles.reverse]: overflows })}>
      <div className={styles.title}>Blocks</div>
      <ul>
        {supportedNodeTypes.map((type, index) => {
          const selected = selectedItemIndex === index;
          return (
            <li
              key={type.value}
              className={classNames({ [styles.selected]: selected })}
              onClick={() => selectItem(type.value)}
            >
              {type.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
