import { SegmentedControl } from "@mantine/core";
import { quizModes } from "../QuizData/modeConfigs";
import { Mode } from "@/types/Mode";

interface ModeSelectProps {
    value: Mode;
    onChange: (mode: Mode) => void;
};

export function ModeSelect({value, onChange}: ModeSelectProps) {
    const items = Object.values(quizModes).map((mode) => ({
        label: mode.label,
        value: mode.id,
    }));
    return (
        <SegmentedControl
          value={value}
          onChange={(val: string) => onChange(val as Mode)}
          data={items}
          fullWidth
          size="md"
        />
      );
}