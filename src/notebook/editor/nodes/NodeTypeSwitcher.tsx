import { BasicNode } from './BasicNode';
import { TimerNode } from '@/notebook/modules/timer/TimerNode';
import type { NodeData } from '@/notebook/utils/types';

interface NodeTypeSwitcherProps {
  node: NodeData;
  updateFocusedIndex: (index: number) => void;
  isFocused: boolean;
  index: number;
}

export function NodeTypeSwitcher({ node, updateFocusedIndex, isFocused, index }: NodeTypeSwitcherProps) {
  if (node.type === 'timer') {
    return <TimerNode node={node} isFocused={isFocused} index={index} />;
  }

  return <BasicNode node={node} updateFocusedIndex={updateFocusedIndex} isFocused={isFocused} index={index} />;
}
