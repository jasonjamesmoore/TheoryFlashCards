import { Divider, Drawer, Stack, Text, Button } from '@mantine/core';
import { useNotebookState } from '@/notebook/state/NotebookStateContext';
import { nanoid } from 'nanoid';
import type { NodeData } from '@/notebook/utils/types';

type PlanningDrawerProps = {
  opened: boolean;
  onClose: () => void;
};

const mockPlan = [
  {
    principle: 'Tone',
    items: [
      {
        title: 'Long Tones',
        actions: [
          {
            description: 'Play long tones with a Concert Bb drone.',
          },
        ],
      },
    ],
  },
  {
    principle: 'Harmony',
    items: [
      {
        title: 'Triads',
        actions: [
          {
            description: 'Play major, minor and diminished triads over Concert Bb drone.',
          },
        ],
      },
    ],
  },
  {
    principle: 'Repertoire',
    items: [
      {
        title: 'Sonnymoon for Two',
        actions: [
          {
            description: 'Play Melody in time with a metronome',
          },
          {
            description: 'Root motion in long tones with Concert Bb Drone',
          },
          {
            description:
              'Play major, minor and diminished triads through the harmony with a Concert Bb Drone. ',
          },
        ],
      },
    ],
  },
];

function PlanningDrawer({ opened, onClose }: PlanningDrawerProps) {
  const { nodes, addNodes } = useNotebookState();

  function handleAcceptPlan() {
    // Add nodes from the mock plan to the notebook state
    const planNodes: NodeData[] = mockPlan.flatMap((plan): NodeData[] => [
        {
          id: nanoid(),
          type: 'heading',
          value: `Principle: ${plan.principle}`,
        },
      ...plan.items.flatMap ((item): NodeData[] => [
          {
             id: nanoid(),
            type: 'text',
            value: `Activity/Context: ${item.title}`,
          },
          ...item.actions.map((action): NodeData => ({ 
              id: nanoid(),
              type: 'list',
              value: action.description,
            })),
      ]),
    ]);
    addNodes(planNodes, nodes.length);
    onClose();
  }



  return (
    <Drawer opened={opened} onClose={onClose} position="top" title="Plan Today">
      <Stack>
        <Divider />
        <Text>Step 1 — Choose today’s principles</Text>
        <Text>Select broad areas to focus on.</Text>
        <Text>Step 2 — Choose practice options</Text>
        <Text>Pick exercises under each principle.</Text>
        <Text>Step 3 — State the work clearly</Text>
        <Text>Define the environment and what you are doing today.</Text>
      </Stack>
      <Button onClick={handleAcceptPlan}>Accept Plan</Button>
    </Drawer>
  );
}


export default PlanningDrawer;
