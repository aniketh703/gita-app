/**
 * Chapter Completion Hook
 * Manages chapter completion state and persistence
 */

import { useCallback, useEffect, useState } from "react";
import {
  getCompletedChapters,
  getCompletionProgress,
  getCompletionStreak,
  isChapterCompleted,
  markChapterComplete,
  type ChapterCompletion,
} from "@/src/utils/readingProgress";

export interface UseChapterCompletionReturn {
  completedChapters: Set<number>;
  completionProgress: number; // 0-100
  completionStreak: number;
  isChapterCompleted: (chapterNumber: number) => boolean;
  markChapterComplete: (chapterNumber: number, duration?: number) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

export function useChapterCompletion(): UseChapterCompletionReturn {
  const [completedChapters, setCompletedChapters] = useState<Set<number>>(
    new Set()
  );
  const [completionProgress, setCompletionProgress] = useState(0);
  const [completionStreak, setCompletionStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load initial state
  useEffect(() => {
    const loadCompletionData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [completions, progress, streak] = await Promise.all([
          getCompletedChapters(),
          getCompletionProgress(),
          getCompletionStreak(),
        ]);

        const chapterSet = new Set(
          completions.map((c: ChapterCompletion) => c.chapterNumber)
        );
        setCompletedChapters(chapterSet);
        setCompletionProgress(progress);
        setCompletionStreak(streak);
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setError(errorObj);
        console.error("Failed to load completion data:", errorObj);
      } finally {
        setIsLoading(false);
      }
    };

    loadCompletionData();
  }, []);

  const checkIsChapterCompleted = useCallback(
    (chapterNumber: number) => {
      return completedChapters.has(chapterNumber);
    },
    [completedChapters]
  );

  const handleMarkComplete = useCallback(
    async (chapterNumber: number, duration?: number) => {
      try {
        setError(null);

        // Optimistically update UI
        setCompletedChapters((prev) => new Set([...prev, chapterNumber]));

        // Persist to storage
        await markChapterComplete(chapterNumber, duration);

        // Update progress and streak
        const [progress, streak] = await Promise.all([
          getCompletionProgress(),
          getCompletionStreak(),
        ]);

        setCompletionProgress(progress);
        setCompletionStreak(streak);
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setError(errorObj);

        // Revert UI on error
        setCompletedChapters((prev) => {
          const updated = new Set(prev);
          updated.delete(chapterNumber);
          return updated;
        });

        console.error("Failed to mark chapter complete:", errorObj);
        throw errorObj;
      }
    },
    []
  );

  return {
    completedChapters,
    completionProgress,
    completionStreak,
    isChapterCompleted: checkIsChapterCompleted,
    markChapterComplete: handleMarkComplete,
    isLoading,
    error,
  };
}
