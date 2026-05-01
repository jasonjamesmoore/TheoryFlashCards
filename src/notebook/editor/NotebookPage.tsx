import { nanoid } from 'nanoid';
import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNotebookState } from '@/notebook/state/NotebookStateContext';
import { NodeTypeSwitcher } from './nodes/NodeTypeSwitcher';
import PlanningDrawer from './PlanningDrawer';
import { Spacer } from './Spacer';
import { useFocusedNodeIndex } from './useFocusedNodeIndex';
import styles from './NotebookPage.module.css';

export function NotebookPage() {
  const { title, setTitle, nodes, addNode } = useNotebookState();
  const [focusedNodeIndex, setFocusedNodeIndex] = useFocusedNodeIndex(nodes);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);

  return (
    <section className={styles.page}>
      <input
        aria-label="Notebook title"
        className={styles.title}
        value={title}
        onChange={(event) => setTitle(event.currentTarget.value)}
      />
      <Button onClick={openDrawer}>Plan Today</Button>
      <PlanningDrawer opened={drawerOpened} onClose={closeDrawer} />

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
