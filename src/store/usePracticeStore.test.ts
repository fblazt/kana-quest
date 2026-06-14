import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { deleteDB } from 'idb';
import 'fake-indexeddb/auto';
import { usePracticeStore } from './usePracticeStore';
import { seedDatabaseIfEmpty } from '../lib/db';

const DB_NAME = 'kana-quest-db';

describe('usePracticeStore', () => {
  beforeEach(async () => {
    await deleteDB(DB_NAME);
    await seedDatabaseIfEmpty();
    usePracticeStore.setState({
      mode: 'practice',
      queue: [],
      currentIndex: 0,
      score: 0,
      lives: 3,
      streak: 0,
      maxStreak: 0,
      startTime: 0,
      questionStartTime: 0,
      totalTime: 0,
      isFinished: false,
      feedback: null,
      sessionStats: {
        totalAnswered: 0,
        totalCorrect: 0,
        totalTime: 0,
        maxStreak: 0,
        masteredKana: [],
        confusedPairs: [],
        mode: 'practice',
      },
    });
  });

  afterEach(async () => {
    await deleteDB(DB_NAME);
  });

  it('should start with initial state', () => {
    const state = usePracticeStore.getState();
    expect(state.isFinished).toBe(false);
    expect(state.score).toBe(0);
    expect(state.lives).toBe(3);
    expect(state.queue).toHaveLength(0);
  });

  it('should start a practice session', async () => {
    await usePracticeStore.getState().startSession('practice', 'hiragana');
    
    const state = usePracticeStore.getState();
    expect(state.queue.length).toBeGreaterThan(0);
    expect(state.mode).toBe('practice');
    expect(state.currentIndex).toBe(0);
    expect(state.isFinished).toBe(false);
  });

  it('should start a survival session', async () => {
    await usePracticeStore.getState().startSession('survival', 'hiragana');
    
    const state = usePracticeStore.getState();
    expect(state.mode).toBe('survival');
    expect(state.lives).toBe(3);
  });

  it('should start a speed session', async () => {
    await usePracticeStore.getState().startSession('speed', 'hiragana');
    
    const state = usePracticeStore.getState();
    expect(state.mode).toBe('speed');
    expect(state.queue.length).toBeGreaterThan(0);
  });

  it('should submit correct answer', async () => {
    await usePracticeStore.getState().startSession('practice', 'hiragana');
    
    const state = usePracticeStore.getState();
    const kana = state.queue[0];
    
    const result = await state.submitAnswer(kana.romaji);
    expect(result).toBe('correct');
    
    const newState = usePracticeStore.getState();
    expect(newState.score).toBe(1);
    expect(newState.streak).toBe(1);
    expect(newState.feedback).toBe('correct');
  });

  it('should submit incorrect answer', async () => {
    await usePracticeStore.getState().startSession('practice', 'hiragana');
    
    const state = usePracticeStore.getState();
    const result = await state.submitAnswer('wrong');
    expect(result).toBe('incorrect');
    
    const newState = usePracticeStore.getState();
    expect(newState.score).toBe(0);
    expect(newState.streak).toBe(0);
    expect(newState.feedback).toBe('incorrect');
  });

  it('should decrement lives on incorrect answer in survival mode', async () => {
    await usePracticeStore.getState().startSession('survival', 'hiragana');
    
    const state = usePracticeStore.getState();
    await state.submitAnswer('wrong');
    
    const newState = usePracticeStore.getState();
    expect(newState.lives).toBe(2);
  });

  it('should advance to next kana', async () => {
    await usePracticeStore.getState().startSession('practice', 'hiragana');
    
    const state = usePracticeStore.getState();
    const initialIndex = state.currentIndex;
    
    state.nextKana();
    
    const newState = usePracticeStore.getState();
    expect(newState.currentIndex).toBe(initialIndex + 1);
    expect(newState.feedback).toBeNull();
  });

  it('should finish session when queue is exhausted', async () => {
    await usePracticeStore.getState().startSession('practice', 'hiragana');
    
    const state = usePracticeStore.getState();
    const queueLength = state.queue.length;
    
    for (let i = 0; i < queueLength; i++) {
      usePracticeStore.getState().nextKana();
    }
    
    const newState = usePracticeStore.getState();
    expect(newState.isFinished).toBe(true);
  });

  it('should end session', async () => {
    await usePracticeStore.getState().startSession('practice', 'hiragana');
    
    usePracticeStore.getState().endSession();
    
    const state = usePracticeStore.getState();
    expect(state.isFinished).toBe(true);
    expect(state.totalTime).toBeGreaterThanOrEqual(0);
  });

  it('should track maxStreak correctly', async () => {
    await usePracticeStore.getState().startSession('practice', 'hiragana');
    
    const state = usePracticeStore.getState();
    const kana1 = state.queue[0];
    const kana2 = state.queue[1];
    
    await state.submitAnswer(kana1.romaji);
    usePracticeStore.getState().nextKana();
    
    await usePracticeStore.getState().submitAnswer(kana2.romaji);
    
    const newState = usePracticeStore.getState();
    expect(newState.maxStreak).toBe(2);
  });
});
