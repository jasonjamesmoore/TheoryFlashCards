export const NOTE_INDEXES: Record<string, number> = {
    'B#': 0, 'C': 0, 
    'C#': 1, 'Db': 1,
    'D': 2, 'D#': 3, 'Eb': 3,
    'E': 4, 'Fb': 4,
    'E#': 5, 'F': 5, 
    'F#': 6, 'Gb': 6,
    'G': 7, 'G#': 8, 'Ab': 8,
    'A': 9, 'A#': 10, 'Bb': 10,
    'B': 11, 'Cb': 11,
  };
  
export const INDEX_TO_NOTE: Record<number, string> = {
    0: 'C', 1: 'C#', 2: 'D', 3: 'D#', 4: 'E',
    5: 'F', 6: 'F#', 7: 'G', 8: 'G#', 9: 'A',
    10: 'A#', 11: 'B',
  };
  
export const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
export const SCALE_DEGREE_NAMES = ['1', '2', '3', '4', '5', '6', '7'];
export const DEGREE_TO_SEMITONES: Record<string, number> = {
    'R': 0,
    'b2': 1,
    '2': 2,
    'b3': 3,
    '3': 4,
    '4': 5,
    '#4': 6,
    'b5': 6,
    '5': 7,
    '#5': 8,
    'b6': 8,
    '6': 9,
    'b7': 10,
    '7': 11,
    'b9': 13,
    '9': 14,
    '#9': 15,
    '11': 17,
    '#11': 18,
    'b13': 20,
    '13': 21,
  };

const SEMITONES_TO_DEGREE: Record<number, string[]> = {
  0: ['R'],
  1: ['b9'],
  2: ['9'],
  3: ['b3', '#9'],
  4: ['3'],
  5: ['11'],
  6: ['#11', 'b5'],
  7: ['5'],
  8: ['#5', 'b13'],
  9: ['13', 'bb7'],
  10: ['b7'],
  11: ['7'],
};
const SHARP_KEYS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#'];
const FLAT_KEYS = ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'];

export function getKeyFromSignature(sig: string): string | null {
  // const SHARP_ORDER = ['F', 'C', 'G', 'D', 'A', 'E', 'B'];
  // const FLAT_ORDER = ['B', 'E', 'A', 'D', 'G', 'C', 'F']; 

  const match = sig.match(/^(\d+)(#|b)$/);
  if (!match) {
    return null; // invalid input
  }

  const [_, numStr, type] = match;
  const count = parseInt(numStr, 10);

  if (type === '#' && count >= 0 && count <= 7) {
    const key = SHARP_KEYS[count];
    return key || null;
  }

  if (type === 'b' && count >= 0 && count <= 7) {
    const key = FLAT_KEYS[count];
    return key || null;
  }
  return null;
};

export function getSignatureFromKey(key: string): string | null {
    const sharpIndex = SHARP_KEYS.indexOf(key);
    if (sharpIndex !== -1) {
        return `${sharpIndex}#`;
    };
    const flatIndex = FLAT_KEYS.indexOf(key);
    if (flatIndex !== -1) {
        return `${flatIndex}b`;
    };

    return null; // invalid input
};

export function getNoteIndex(note: string): number {
  return NOTE_INDEXES[note];
}

export function getNoteName(index: number): string {
  return INDEX_TO_NOTE[index % 12];
}

// keeping this function in case I want diatonic quizzes:
// export function getDiatonicScaleDegree(note: string, key: string): string | null {
//   const noteIndex = getNoteIndex(note);
//   const keyIndex = getNoteIndex(key);

//   if (noteIndex === undefined || keyIndex === undefined) {
//     return null; // invalid input
//   }

//   const scale = MAJOR_SCALE_INTERVALS.map((interval) => (keyIndex + interval) % 12);
//   const degreeIndex = scale.indexOf(noteIndex);
//   console.log('degreeIndex:', degreeIndex);
//   console.log('Scale:', scale, 'degree:', SCALE_DEGREE_NAMES[degreeIndex]);

//   return degreeIndex !== -1 ? SCALE_DEGREE_NAMES[degreeIndex] : null;
// }

//keeping this function in case I want diatonic quizzes:
// export function getNoteFromDegreeInKey(degree: string, key: string): string | null {
//   const keyIndex = getNoteIndex(key);
//   const degreeIndex = SCALE_DEGREE_NAMES.indexOf(degree);

//   if (degreeIndex === -1) {
//     return null;
//   }

//   const scale = MAJOR_SCALE_INTERVALS.map((interval) => (keyIndex + interval) % 12);
//   const noteIndexFromDegree = scale[degreeIndex];
//   return getNoteName(noteIndexFromDegree);
// }

export function getScaleDegree(note: string, key: string): string | null {
  const noteIndex = getNoteIndex(note);
  const keyIndex = getNoteIndex(key);

  if (noteIndex === undefined || keyIndex === undefined) {
    return null; // invalid input
  }

  const distance = (noteIndex - keyIndex + 12) % 12;
  return SEMITONES_TO_DEGREE[distance]?.[0] ?? null; // return the first degree name or null if not found
}

export function getNotefromDegree(degree: string, key: string): string | null {
  const keyIndex = getNoteIndex(key);
  const degreeToSemitones = DEGREE_TO_SEMITONES[degree];
  if (degreeToSemitones === undefined) {
    return null; // invalid input
  }
  const noteIndexFromDegree = (keyIndex + degreeToSemitones) % 12;
  return getNoteName(noteIndexFromDegree);
};

export function getKeyFromNoteAndDegree(note: string, degree: string): string | null {
    const noteIndex = getNoteIndex(note);
    const degreeToSemitones = DEGREE_TO_SEMITONES[degree];
    if (degreeToSemitones === undefined) {
        return null; // invalid input
    };
    const keyIndex = (noteIndex - degreeToSemitones + 12) % 12;
    return getNoteName(keyIndex);
};
