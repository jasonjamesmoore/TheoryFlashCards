import type {
  ActivityOptionsByPrinciple,
  NodeData,
  NodeType,
  NotebookState,
  PracticePage,
} from '@/notebook/utils/types';
import { createInitialNotebookState } from './starterData';

const VALID_NODE_TYPES: readonly NodeType[] = ['text', 'list', 'heading', 'timer'];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isNodeType = (value: unknown): value is NodeType =>
  typeof value === 'string' && VALID_NODE_TYPES.includes(value as NodeType);

const isNodeData = (value: unknown): value is NodeData => {
  if (!isRecord(value)) {
    return false;
  }
  return typeof value.id === 'string' && typeof value.value === 'string' && isNodeType(value.type);
};

const isPracticePage = (value: unknown, expectedDate: string): value is PracticePage => {
  if (!isRecord(value)) {
    return false;
  }
  if (value.schemaVersion !== 1) {
    return false;
  }
  if (typeof value.id !== 'string') {
    return false;
  }
  if (typeof value.date !== 'string' || value.date !== expectedDate) {
    return false;
  }
  if (typeof value.updatedAt !== 'string') {
    return false;
  }
  if (typeof value.title !== 'string') {
    return false;
  }
  if (!Array.isArray(value.nodes) || !value.nodes.every(isNodeData)) {
    return false;
  }
  return true;
};

export const getPageStorageKey = (date: string) => `practicekit:notebook:v1:page:${date}`;
export const getPrinciplesStorageKey = () => `practicekit:principles:v1`;
export const getActivityOptionsStorageKey = () => `practicekit:activities:v1`;
export const normalizePrincipleKey = (principle: string) => principle.trim().toLowerCase();

const DEFAULT_PRINCIPLES = ['Tone', 'Time', 'Harmony', 'Technique', 'Repertoire'];
const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');
const isActivityOptionsByPrinciple = (value: unknown): value is ActivityOptionsByPrinciple => {
  if (!isRecord(value)) {
    return false;
  }
  return Object.values(value).every(isStringArray);
};

export function loadPrinciples(): string[] {
  try {
    const raw = window.localStorage.getItem(getPrinciplesStorageKey());
    if (!raw) {
      return DEFAULT_PRINCIPLES;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!isStringArray(parsed)) {
      return DEFAULT_PRINCIPLES;
    }
    return parsed;
  } catch {
    return DEFAULT_PRINCIPLES;
  }
}

export function savePrinciples(principles: string[]): void {
  window.localStorage.setItem(getPrinciplesStorageKey(), JSON.stringify(principles));
}

export function loadActivityOptionsByPrinciple(): ActivityOptionsByPrinciple {
  try {
    const raw = window.localStorage.getItem(getActivityOptionsStorageKey());
    if (!raw) {
      return {};
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isActivityOptionsByPrinciple(parsed)) {
      return {};
    }
    return parsed;
  } catch {
    return {};
  }
}

export function saveActivityOptionsByPrinciple(pools: ActivityOptionsByPrinciple): void {
  window.localStorage.setItem(getActivityOptionsStorageKey(), JSON.stringify(pools));
}

export function saveNotebookPage(date: string, notebookState: NotebookState): void {
  const page: PracticePage = {
    id: date,
    date,
    schemaVersion: 1,
    updatedAt: new Date().toISOString(),
    title: notebookState.title,
    nodes: notebookState.nodes,
  };

  localStorage.setItem(getPageStorageKey(date), JSON.stringify(page));
}

export function loadNotebookPage(date: string): NotebookState {
  try {
    const raw = localStorage.getItem(getPageStorageKey(date));
    if (!raw) {
      return createInitialNotebookState();
    }

    const parsed: unknown = JSON.parse(raw);
    if (!isPracticePage(parsed, date)) {
      return createInitialNotebookState();
    }

    return {
      title: parsed.title,
      nodes: parsed.nodes,
    };
  } catch {
    return createInitialNotebookState();
  }
}

export function listSavedPages(): PracticePage[] {
  const pageKeyPrefix = 'practicekit:notebook:v1:page:';
  const practicePages: PracticePage[] = [];

  for (let index = 0; index < localStorage.length; index += 1) {
    const storageKey = localStorage.key(index);

    if (!storageKey) {
      continue;
    }

    try {
      if (!storageKey.startsWith(pageKeyPrefix)) {
        continue;
      }

      const date = storageKey.slice(pageKeyPrefix.length);

      const raw = localStorage.getItem(storageKey);
      if (!raw) {
        continue;
      }
      const parsed: unknown = JSON.parse(raw);
      if (isPracticePage(parsed, date)) {
        practicePages.push(parsed);
      }
    } catch {
      continue;
    }
  }
  return practicePages.sort((a, b) => b.date.localeCompare(a.date));
}
