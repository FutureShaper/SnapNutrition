"use client";

import type { MealEntry } from '@/types';

const HISTORY_KEY = 'snapNutritionHistory';
const MAX_HISTORY_ITEMS = 20; // Limit the number of items in history

export function getHistory(): MealEntry[] {
  if (typeof window === 'undefined') {
    return [];
  }
  const storedHistory = localStorage.getItem(HISTORY_KEY);
  return storedHistory ? JSON.parse(storedHistory) : [];
}

export function addMealToHistory(meal: MealEntry): MealEntry[] {
  if (typeof window === 'undefined') {
    return [];
  }
  const currentHistory = getHistory();
  const updatedHistory = [meal, ...currentHistory].slice(0, MAX_HISTORY_ITEMS);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  return updatedHistory;
}

export function clearHistoryStorage(): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem(HISTORY_KEY);
}
