import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import { Button, Divider, Drawer, Stack, Text } from '@mantine/core';
import { useNotebookState } from '@/notebook/state/NotebookStateContext';
import type { ActivityOptionsByPrinciple, NodeData } from '@/notebook/utils/types';
import { CreatableMultiSelect } from '../components/CreatableMultiSelect';
import {
  loadActivityOptionsByPrinciple,
  loadPrinciples,
  normalizePrincipleKey,
  saveActivityOptionsByPrinciple,
  savePrinciples,
} from '../utils/storage';

type PlanningDrawerProps = {
  opened: boolean;
  onClose: () => void;
};

type SelectedActivitiesByPrinciple = Record<string, string[]>;

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
  const [allPrinciples, setAllPrinciples] = useState<string[]>(() => loadPrinciples());
  const [selectedPrinciples, setSelectedPrinciples] = useState<string[]>([]);
  const [activityOptionsByPrinciple, setActivityOptionsByPrinciple] =
    useState<ActivityOptionsByPrinciple>(() => loadActivityOptionsByPrinciple());
  const [selectedActivitiesByPrinciple, setSelectedActivitiesByPrinciple] =
    useState<SelectedActivitiesByPrinciple>({});

  function handleCreatePrinciple(newItem: string) {
    const updated = [...allPrinciples, newItem];
    setAllPrinciples(updated);
    savePrinciples(updated);
  }

  function handleCreateActivityOption(principleKey: string, newItem: string) {
    setActivityOptionsByPrinciple((prev) => ({
      ...prev,
      [principleKey]: [...(prev[principleKey] || []), newItem],
    }));
  }

  useEffect(() => {
    saveActivityOptionsByPrinciple(activityOptionsByPrinciple);
  }, [activityOptionsByPrinciple]);

  function handleAcceptPlan() {
    // Add nodes from the mock plan to the notebook state
    const planNodes: NodeData[] = mockPlan.flatMap((plan): NodeData[] => [
      {
        id: nanoid(),
        type: 'heading',
        value: `Principle: ${plan.principle}`,
      },
      ...plan.items.flatMap((item): NodeData[] => [
        {
          id: nanoid(),
          type: 'text',
          value: `Activity/Context: ${item.title}`,
        },
        ...item.actions.map(
          (action): NodeData => ({
            id: nanoid(),
            type: 'list',
            value: action.description,
          })
        ),
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
        <CreatableMultiSelect
          allItems={allPrinciples}
          selectedItems={selectedPrinciples}
          onSelectedItemsChange={setSelectedPrinciples}
          onCreateItem={handleCreatePrinciple}
          placeholder="Add a principle..."
          displayMode="capitalize"
        />

        <Divider />
        <Text>Step 2 — Choose practice options</Text>
        <Text>Pick exercises under each principle.</Text>
        {selectedPrinciples.map((principle) => {
          const principleKey = normalizePrincipleKey(principle);
          return (
            <div key={principle}>
              <Text fw={700}>{principle}</Text>
              <CreatableMultiSelect
                allItems={activityOptionsByPrinciple[principleKey] || []}
                selectedItems={selectedActivitiesByPrinciple[principleKey] || []}
                onSelectedItemsChange={(selected) =>
                  setSelectedActivitiesByPrinciple((prev) => ({
                    ...prev,
                    [principleKey]: selected,
                  }))
                }
                onCreateItem={(newItem) => handleCreateActivityOption(principleKey, newItem)}
                placeholder={`Add an activity for ${principle.toLowerCase()}...`}
              />
            </div>
          );
        })}

        <Text>Step 3 — State the work clearly</Text>
        <Text>Define the environment and what you are doing today.</Text>
      </Stack>
      <Button onClick={handleAcceptPlan}>Accept Plan</Button>
    </Drawer>
  );
}

export default PlanningDrawer;
