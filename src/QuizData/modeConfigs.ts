import {QuizMode} from '../types/Quiz';
import {Mode} from '../types/Mode';
import {getKeyFromNoteAndDegree, getNotefromDegree, getScaleDegree, getSignatureFromKey, getKeyFromSignature} from '../theory/noteUtils';


export const quizModes: Record<Mode, QuizMode> = {
    [Mode.DEGREE_FINDER]: {
        id: Mode.DEGREE_FINDER,
        label: 'Find the scale degree',
        description: 'Given a key and a note, find the scale degree.',
        promptDecks: ['key', 'note'],
        answerDeck: 'degree',
        computeAnswer: ({key, note}) => getScaleDegree(note, key),
    },
    [Mode.NOTE_FINDER]: {
        id: Mode.NOTE_FINDER,
        label: 'Find the note',
        description: 'Given a key and a note, find the scale degree.',
        promptDecks: ['key', 'degree'],
        answerDeck: 'note',
        computeAnswer: ({key, degree}) => getNotefromDegree(degree, key),
    }, 
    [Mode.KEY_FINDER]: {
        id: Mode.KEY_FINDER,
        label: 'Find the key',
        description: 'Given a note and a scale degree, find the key.',
        promptDecks: ['note', 'degree'],
        answerDeck: 'key',
        computeAnswer: ({note, degree}) => getKeyFromNoteAndDegree(note, degree),
    },
    [Mode.KEY_ONLY]: {
        id: Mode.KEY_ONLY,
        label: 'Key ↔︎ Signature',
        description: 'What is the key or Key signature?',
        variants: [
            {
              promptDecks: ['key'],
              answerDeck: 'signature',
              computeAnswer: ({ key }) => getSignatureFromKey(key),
            },
            {
              promptDecks: ['signature'],
              answerDeck: 'key',
              computeAnswer: ({ signature }) => getKeyFromSignature(signature),
            },
          ],
    }
}