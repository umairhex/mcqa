import type { QuizQuestion } from "../types/quiz";

export interface HistoryItem {
  id: string;
  timestamp: number;
  questions: QuizQuestion[];
  preview: string;
  count: number;
}

const HISTORY_KEY = "quiz_history_v1";
const MAX_HISTORY = 20;

export function saveToHistory(questions: QuizQuestion[]) {
  if (!questions || questions.length === 0) return;

  try {
    const history = getHistory();

    if (history.length > 0) {
      const latest = history[0];
      if (
        latest.questions.length === questions.length &&
        latest.questions[0].question === questions[0].question
      ) {
        return;
      }
    }

    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      questions,
      preview:
        questions[0].question.substring(0, 60) +
        (questions[0].question.length > 60 ? "..." : ""),
      count: questions.length,
    };

    const newHistory = [newItem, ...history].slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  } catch (e) {
    console.error("Failed to save history:", e);
  }
}

export function getHistory(): HistoryItem[] {
  try {
    if (typeof window === "undefined") return [];
    const json = localStorage.getItem(HISTORY_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error("Failed to load history:", e);
    return [];
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.error("Failed to clear history:", e);
  }
}

export function deleteHistoryItem(id: string): HistoryItem[] {
  try {
    const history = getHistory();
    const newHistory = history.filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    return newHistory;
  } catch (e) {
    console.error("Failed to delete history item:", e);
    return [];
  }
}
