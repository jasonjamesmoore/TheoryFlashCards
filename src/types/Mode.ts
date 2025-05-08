export enum Mode {
  DEGREE_FINDER = 'degree-finder',
  NOTE_FINDER = 'note-finder',
  KEY_FINDER = 'key-finder',
  KEY_ONLY = 'key-only',
}

export const modeLabels: Record<Mode, string> = {
  [Mode.DEGREE_FINDER]: 'Find the scale degree',
  [Mode.NOTE_FINDER]: 'Find the note',
  [Mode.KEY_FINDER]: 'Find the key',
  [Mode.KEY_ONLY]: 'Key Signature Quiz',
};
