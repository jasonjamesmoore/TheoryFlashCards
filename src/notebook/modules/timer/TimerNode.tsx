import { useEffect, useState } from 'react';
import { Button, Card } from '@mantine/core';
import type { NodeData } from '@/notebook/utils/types';
import { useNotebookState } from '@/notebook/state/NotebookStateContext';
import { Countdown } from './Countdown';
import { TimePickButton } from './TimePickButtons';
import alarmSound from '@/notebook/assets/Alarming.mp3';
import styles from './TimerNode.module.css';

interface TimerNodeProps {
  node: NodeData;
  isFocused: boolean;
  index: number;
}

export function TimerNode({ node, isFocused, index }: TimerNodeProps) {
  const { removeNodeByIndex } = useNotebookState();
  const [totalTime, setTotalTime] = useState(1800);
  const [seconds, setSeconds] = useState(totalTime);
  const [isRunning, setIsRunning] = useState(false);
  const [newTimePicked, setNewTimePicked] = useState(true);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      if (event.key === 'Backspace') {
        removeNodeByIndex(index);
      }
    };

    if (isFocused) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFocused, removeNodeByIndex, index, node]);

  const playSound = () => {
    const audio = new Audio(alarmSound);
    audio.volume = 0.7;
    void audio.play();
  };

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    setSeconds(totalTime);
    const timer = window.setInterval(() => {
      setSeconds((s) => {
        if (s > 1) {
          return s - 1;
        }

        window.clearInterval(timer);
        setIsRunning(false);
        setNewTimePicked(false);
        playSound();
        return 0;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [isRunning, totalTime]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleTimeChange = (newTime: number) => {
    setIsRunning(false);
    setTotalTime(newTime);
    setSeconds(newTime);
    setNewTimePicked(true);
  };

  return (
    <Card shadow="xl" withBorder>
      <div className={styles.timerNodeContainer}>
        <div className={styles.countdownContainer}>
          <Countdown
            size={150}
            timeRemaining={seconds}
            totalTime={totalTime}
            onClick={handleStart}
            isRunning={isRunning}
            newTimePicked={newTimePicked}
          />
        </div>
        <Button.Group className={styles.timePickButtons}>
          <TimePickButton
            time={1800}
            displayTime="30 min"
            onPick={handleTimeChange}
            isActive={totalTime === 1800}
          />
          <TimePickButton
            time={900}
            displayTime="15 min"
            onPick={handleTimeChange}
            isActive={totalTime === 900}
          />
          <TimePickButton
            time={300}
            displayTime="5 min"
            onPick={handleTimeChange}
            isActive={totalTime === 300}
          />
        </Button.Group>
      </div>
    </Card>
  );
}
