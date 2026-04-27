import { Button } from '@mantine/core';
import styles from './TimePickButtons.module.css';

interface TimePickButtonProps {
  time: number;
  displayTime: string;
  onPick: (newTime: number) => void;
  isActive: boolean;
}

export function TimePickButton({ time, displayTime, onPick, isActive }: TimePickButtonProps) {
  const handleClick = () => {
    onPick(time);
  };

  return (
    <Button size="compact-sm" variant="default" radius="md" onClick={handleClick}>
      <span className={isActive ? styles.active : styles.inactive}>{displayTime}</span>
    </Button>
  );
}
