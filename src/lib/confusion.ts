import type { IDBPDatabase } from 'idb';
import type { KanaQuestDB } from './db';
import type { ConfusionPair } from '../types/kana';

function getConfusionPairId(shown: string, answered: string): string {
  return `${shown}_${answered}`;
}

export async function logConfusionPair(
  db: IDBPDatabase<KanaQuestDB>,
  shown: string,
  answered: string
): Promise<void> {
  const id = getConfusionPairId(shown, answered);
  const existing = await db.get('confusion_matrix', id);

  if (existing) {
    await db.put('confusion_matrix', {
      ...existing,
      count: existing.count + 1,
    });
  } else {
    await db.put('confusion_matrix', {
      id,
      shown,
      answered,
      count: 1,
    });
  }
}

export async function getConfusionPairs(
  db: IDBPDatabase<KanaQuestDB>
): Promise<ConfusionPair[]> {
  const all = await db.getAll('confusion_matrix');
  return all.sort((a, b) => b.count - a.count);
}

export async function getConfusionPairsForKana(
  db: IDBPDatabase<KanaQuestDB>,
  kanaId: string
): Promise<ConfusionPair[]> {
  const all = await db.getAll('confusion_matrix');
  return all
    .filter(p => p.shown === kanaId)
    .sort((a, b) => b.count - a.count);
}
