import { useState } from "react";
import { ModeSelect } from "@/components/ModeSelect";
import { Mode } from "@/types/Mode";

export function Home() {
  const [mode, setMode] = useState<Mode>(Mode.KEY_ONLY);

  return (
    <>
    <ModeSelect value={mode} onChange={setMode} />
    {/* conditional rendering of the quiz mode */}
    {/* {mode === "" && <QuizComponent />} */}
     
    </>
  );
}
