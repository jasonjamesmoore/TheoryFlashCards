import { Divider, Drawer, Stack, Text } from '@mantine/core';

type PlanningDrawerProps = {
  opened: boolean;
  onClose: () => void;
};

function PlanningDrawer({ opened, onClose }: PlanningDrawerProps) {
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
    </Drawer>
  );
}

export default PlanningDrawer;
