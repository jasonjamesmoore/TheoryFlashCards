import { nanoid } from 'nanoid';
import { useNotebookState } from '@/notebook/state/NotebookStateContext';
import { useFocusedNodeIndex } from './useFocusedNodeIndex';
import { NodeTypeSwitcher } from './nodes/NodeTypeSwitcher';
import { Spacer } from './Spacer';
import styles from './NotebookPage.module.css';

export function NotebookPage() {
  const { title, setTitle, nodes, addNode } = useNotebookState();
  const [focusedNodeIndex, setFocusedNodeIndex] = useFocusedNodeIndex(nodes);

  return (
    <section className={styles.page}>
      <input
        aria-label="Notebook title"
        className={styles.title}
        value={title}
        onChange={(event) => setTitle(event.currentTarget.value)}
      />

      {nodes.map((node, index) => {
        return (
          <NodeTypeSwitcher
            key={node.id}
            node={node}
            isFocused={focusedNodeIndex === index}
            updateFocusedIndex={setFocusedNodeIndex}
            index={index}
          />
        );
      })}

      <Spacer
        handleClick={() => {
          addNode({ type: 'text', value: '', id: nanoid() }, nodes.length);
        }}
        showHint={nodes.length === 0}
      />
    </section>
  );
}
